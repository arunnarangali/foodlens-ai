import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../App';

const stop = vi.fn();
const stream = { getTracks: () => [{ stop }] } as unknown as MediaStream;

beforeEach(() => {
  stop.mockClear();
  URL.createObjectURL = vi.fn(() => 'blob:camera-photo');
  URL.revokeObjectURL = vi.fn();
  window.location.hash = '#/analyze';
  vi.stubGlobal('navigator', {
    mediaDevices: { getUserMedia: vi.fn().mockResolvedValue(stream) },
  });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

async function openCamera() {
  fireEvent.click(screen.getByRole('button', { name: 'Take a photo' }));
  await waitFor(() => expect((screen.getByRole('button', { name: 'Capture photo' }) as HTMLButtonElement).disabled).toBe(false));
}

it('opens the camera without audio and releases it on cancel', async () => {
  render(<App />); await openCamera();
  expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: false, video: { facingMode: { ideal: 'environment' } } });
  expect((screen.getByLabelText('Live camera preview') as HTMLVideoElement).srcObject).toBe(stream);
  fireEvent.click(screen.getByRole('button', { name: 'Cancel camera' }));
  expect(stop).toHaveBeenCalledTimes(1);
  expect(screen.queryByLabelText('Live camera preview')).toBeNull();
});

it('captures JPEG into the existing preview without submitting it', async () => {
  const fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock);
  vi.spyOn(HTMLVideoElement.prototype, 'videoWidth', 'get').mockReturnValue(640);
  vi.spyOn(HTMLVideoElement.prototype, 'videoHeight', 'get').mockReturnValue(480);
  const drawImage = vi.fn();
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage } as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(callback => callback(new Blob(['synthetic-image'], { type: 'image/jpeg' })));
  render(<App />); await openCamera();
  fireEvent.click(screen.getByRole('button', { name: 'Capture photo' }));
  await screen.findByAltText('Selected food preview');
  expect(drawImage).toHaveBeenCalled();
  expect(screen.getByText('food-camera.jpg')).toBeTruthy();
  expect(stop).toHaveBeenCalledTimes(1);
  expect(fetchMock).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Remove image' }));
  expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:camera-photo');
});

it('shows a helpful permission error while preserving the file picker', async () => {
  vi.stubGlobal('navigator', { mediaDevices: { getUserMedia: vi.fn().mockRejectedValue(new DOMException('denied', 'NotAllowedError')) } });
  render(<App />); fireEvent.click(screen.getByRole('button', { name: 'Take a photo' }));
  await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('permission was denied'));
  expect(screen.getByLabelText('Choose a food photo')).toBeTruthy();
});

it('handles browsers without live camera support', () => {
  vi.stubGlobal('navigator', {}); render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Take a photo' }));
  expect(screen.getByRole('alert').textContent).toContain('HTTPS or localhost');
});

it('stops a late permission response after cancellation', async () => {
  let resolve!: (value: MediaStream) => void;
  vi.stubGlobal('navigator', { mediaDevices: { getUserMedia: vi.fn(() => new Promise<MediaStream>(done => { resolve = done; })) } });
  render(<App />); fireEvent.click(screen.getByRole('button', { name: 'Take a photo' }));
  fireEvent.click(screen.getByRole('button', { name: 'Cancel camera' }));
  resolve(stream);
  await waitFor(() => expect(stop).toHaveBeenCalledTimes(1));
  expect(screen.queryByLabelText('Live camera preview')).toBeNull();
});

it('stops the camera when the page unmounts', async () => {
  const view = render(<App />); await openCamera(); view.unmount();
  expect(stop).toHaveBeenCalledTimes(1);
});

it('waits for a ready video frame before capture', async () => {
  render(<App />); await openCamera();
  fireEvent.click(screen.getByRole('button', { name: 'Capture photo' }));
  expect(screen.getByRole('alert').textContent).toContain('camera is not ready');
  expect(screen.queryByAltText('Selected food preview')).toBeNull();
});
