import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import App from "../App";
import { MAX_IMAGE_BYTES, validateImage } from "../components/ImageUploader";
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
beforeEach(() => {
  URL.createObjectURL = vi.fn(() => "blob:preview");
  URL.revokeObjectURL = vi.fn();
  window.scrollTo = vi.fn();
  window.location.hash = "#/analyze";
});
const photo = () => new File(["image"], "meal.png", { type: "image/png" });
describe("upload validation", () => {
  it("accepts supported formats and the size boundary", () => {
    for (const type of ["image/png", "image/jpeg", "image/webp"])
      expect(validateImage(new File(["x"], "meal", { type }))).toBeNull();
    expect(
      validateImage(
        new File([new Uint8Array(MAX_IMAGE_BYTES)], "meal.png", {
          type: "image/png",
        }),
      ),
    ).toBeNull();
  });
  it("rejects empty, unsupported and oversized files", () => {
    expect(
      validateImage(new File([], "empty.png", { type: "image/png" })),
    ).toContain("empty");
    expect(
      validateImage(new File(["text"], "fake.png", { type: "text/plain" })),
    ).toContain("JPEG");
    expect(
      validateImage(
        new File([new Uint8Array(MAX_IMAGE_BYTES + 1)], "large.png", {
          type: "image/png",
        }),
      ),
    ).toContain("5 MiB");
  });
});
it("previews and removes the image, releasing the preview URL", () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText("Choose a food photo"), {
    target: { files: [photo()] },
  });
  expect(screen.getByAltText("Selected food preview")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Remove image" }));
  expect(screen.queryByAltText("Selected food preview")).toBeNull();
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview");
  expect(
    (
      screen.getByRole("button", {
        name: /Analyze photo/,
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(true);
});
it("shows an invalid-file message", () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText("Choose a food photo"), {
    target: { files: [new File(["x"], "bad.txt", { type: "text/plain" })] },
  });
  expect(screen.getByRole("alert").textContent).toContain("JPEG");
});
const result = {
 status: 'analyzed', dishName: 'Likely vegetable rice', identificationConfidence: 'medium',
 visibleIngredients: ['rice', 'peas'],
 nutritionEstimate: {servingAssumption:'One medium bowl', confidence:'low', caloriesKcal:{min:200,max:500},proteinGrams:null,carbohydrateGrams:{min:40,max:80},fatGrams:{min:3,max:15}},
 preparationIdea:['Cook rice with vegetables.'],uncertainties:['Oil and portion sizes are uncertain.'],disclaimer:'Educational estimation, not medical advice.'
};
function submitPhoto() {
 fireEvent.change(screen.getByLabelText('Choose a food photo'),{target:{files:[photo()]}});
 fireEvent.click(screen.getByRole('button',{name:/Analyze photo/}));
}
it('sends multipart data and renders analysis ranges and unknown nutrients', async () => {
 const fetchMock=vi.fn().mockResolvedValue({ok:true,json:async()=>result});vi.stubGlobal('fetch',fetchMock);render(<App/>);submitPhoto();
 await screen.findByText('Likely vegetable rice');
 expect(screen.getByText('200–500 kcal')).toBeTruthy();expect(screen.getByText('Unknown')).toBeTruthy();
 expect(screen.getByText('One medium bowl')).toBeTruthy();expect(screen.getByText(result.disclaimer)).toBeTruthy();
 expect(screen.getByText(result.uncertainties[0])).toBeTruthy();expect(screen.getByText(result.preparationIdea[0])).toBeTruthy();
 expect(fetchMock.mock.calls[0][0]).toBe('/api/analyze');expect(fetchMock.mock.calls[0][1].body.get('image').name).toBe('meal.png');
});
it('renders unclear photos without nutrition or preparation advice', async () => {
 vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({status:'notFoodOrUnclear',dishName:'No clear food visible',identificationConfidence:'low',visibleIngredients:[],nutritionEstimate:null,preparationIdea:[],uncertainties:['Please choose a clearer food photo.'],disclaimer:result.disclaimer})}));
 render(<App/>);submitPhoto();await screen.findByText('Please choose a clearer food photo.');
 expect(screen.queryByText('Approximate nutrition')).toBeNull();expect(screen.queryByText('Simple preparation idea')).toBeNull();
});
it('keeps the upload disabled while analysis is pending', async () => {
 let complete!: (response:unknown)=>void;
 vi.stubGlobal('fetch',vi.fn(()=>new Promise(resolve=>{complete=resolve;})));
 render(<App/>);submitPhoto();expect((screen.getByRole('button',{name:/Analyzing photo/}) as HTMLButtonElement).disabled).toBe(true);
 complete({ok:true,json:async()=>result});await screen.findByText('Likely vegetable rice');
});
it.each([429,503,504])('displays a safe provider error for HTTP %s', async status => {
 vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:false,status,json:async()=>({error:{message:'Please try again later.'}})}));
 render(<App/>);submitPhoto();await waitFor(()=>expect(screen.getByRole('alert').textContent).toContain('Please try again later.'));
});
it('handles plain-text proxy failures', async () => {
 vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:false,json:async()=>{throw new SyntaxError('not JSON');}}));
 render(<App/>);submitPhoto();await waitFor(()=>expect(screen.getByRole('alert').textContent).toContain('backend is running'));
});
it('rejects invalid success data', async () => {
 vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({...result,nutritionEstimate:{...result.nutritionEstimate,caloriesKcal:{min:500,max:200}}})}));
 render(<App/>);submitPhoto();await waitFor(()=>expect(screen.getByRole('alert').textContent).toContain('invalid analysis'));
});
it('handles network and browser timeout errors', async () => {
 const fetchMock=vi.fn().mockRejectedValueOnce(new TypeError('network failure')).mockRejectedValueOnce(new DOMException('aborted','AbortError'));
 vi.stubGlobal('fetch',fetchMock);render(<App/>);submitPhoto();
 await waitFor(()=>expect(screen.getByRole('alert').textContent).toContain('Could not reach the server'));
 fireEvent.click(screen.getByRole('button',{name:/Analyze photo/}));
 await waitFor(()=>expect(screen.getByRole('alert').textContent).toContain('timed out'));
});
it("shows server errors and allows retry", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue({
        ok: false,
        json: async () => ({ error: { message: "Choose another image." } }),
      }),
  );
  render(<App />);
  fireEvent.change(screen.getByLabelText("Choose a food photo"), {
    target: { files: [photo()] },
  });
  fireEvent.click(screen.getByRole("button", { name: /Analyze photo/ }));
  await waitFor(() =>
    expect(screen.getByRole("alert").textContent).toContain(
      "Choose another image.",
    ),
  );
  expect(
    (
      screen.getByRole("button", {
        name: /Analyze photo/,
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(false);
});

it('copies ranges, assumptions, uncertainties and disclaimer', async () => {
 const writeText = vi.fn().mockResolvedValue(undefined);
 vi.stubGlobal('navigator', {clipboard:{writeText}});
 vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok:true,json:async()=>result}));
 render(<App/>);submitPhoto();await screen.findByText(result.dishName);
 fireEvent.click(screen.getByRole('button',{name:'Copy results'}));
 await screen.findByText('Results copied.');
 const copied = writeText.mock.calls[0][0];
 for (const required of ['200–500 kcal','One medium bowl','Unknown',result.uncertainties[0],result.disclaimer]) expect(copied).toContain(required);
});
it('provides selectable text when clipboard access fails', async () => {
 vi.stubGlobal('navigator', {clipboard:{writeText:vi.fn().mockRejectedValue(new Error('denied'))}});
 vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok:true,json:async()=>result}));
 render(<App/>);submitPhoto();await screen.findByText(result.dishName);
 fireEvent.click(screen.getByRole('button',{name:'Copy results'}));
 const fallback=await screen.findByLabelText('Results to copy');
 expect((fallback as HTMLTextAreaElement).value).toContain(result.disclaimer);
});
it('prevents duplicate submissions and keeps accuracy and cloud notices visible', async () => {
 let complete!: (response:unknown)=>void;
 const fetchMock=vi.fn(()=>new Promise(resolve=>{complete=resolve;}));vi.stubGlobal('fetch',fetchMock);
 render(<App/>);
 expect(screen.getByText(/FoodLens is educational and does not provide/)).toBeTruthy();
 expect(screen.getByText(/Submitting sends your photo to Ollama Cloud/)).toBeTruthy();
 fireEvent.change(screen.getByLabelText('Choose a food photo'),{target:{files:[photo()]}});
 const form=screen.getByRole('button',{name:/Analyze photo/}).closest('form')!;
 fireEvent.submit(form);fireEvent.submit(form);
 expect(fetchMock).toHaveBeenCalledTimes(1);
 expect(screen.getByText(/FoodLens is educational and does not provide/)).toBeTruthy();
 complete({ok:true,json:async()=>result});await screen.findByText(result.dishName);
 expect(screen.getByText(/FoodLens is educational and does not provide/)).toBeTruthy();
});
it('validates an empty form without a cloud request', () => {
 const fetchMock=vi.fn();vi.stubGlobal('fetch',fetchMock);render(<App/>);
 fireEvent.submit(screen.getByRole('button',{name:/Analyze photo/}).closest('form')!);
 expect(screen.getByRole('alert').textContent).toContain('Choose a food photo');
 expect(fetchMock).not.toHaveBeenCalled();
});

describe('landing page sections and sample showcase', () => {
  it('renders landing page navigation links and hero CTA', () => {
    render(<App initialRoute="landing" />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(within(nav).getByRole('link', { name: 'How It Works' })).toHaveProperty('hash', '#how-it-works');
    expect(within(nav).getByRole('link', { name: 'Sample Result' })).toHaveProperty('hash', '#sample-result');
    expect(within(nav).getByRole('link', { name: 'Why Ranges?' })).toHaveProperty('hash', '#why-ranges');
    expect(within(nav).getByRole('link', { name: 'Privacy' })).toHaveProperty('hash', '#privacy');
    expect(within(nav).getByRole('button', { name: /Launch Analyzer/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Launch FoodLens Analyzer/ })).toBeTruthy();
    expect(screen.getByText('✔ Honest Ranges')).toBeTruthy();
    expect(screen.getByText('✔ Zero Saved Photos')).toBeTruthy();
    expect(screen.getByText('✔ Camera Ready')).toBeTruthy();
  });

  it('renders the How It Works steps and Sample Meal Showcase card', () => {
    render(<App initialRoute="landing" />);
    expect(screen.getByRole('heading', { name: 'How FoodLens AI Works' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Snap or Upload' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'AI Vision Analysis' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Honest Range Estimates' })).toBeTruthy();

    // Sample meal showcase verification
    expect(screen.getByText('Sample illustrative result')).toBeTruthy();
    expect(screen.getByText('Mediterranean Quinoa & Chickpea Bowl')).toBeTruthy();
    expect(screen.getByText('380–480 kcal')).toBeTruthy();
    expect(screen.getByText('14–19 g')).toBeTruthy();
    expect(screen.getByText('Cooked quinoa')).toBeTruthy();
    expect(screen.getByText('Seasoned chickpeas')).toBeTruthy();
    expect(screen.getByText(/One standard shallow bowl/)).toBeTruthy();
  });

  it('renders the Photo Reality Gap and Trust & Safety sections', () => {
    render(<App initialRoute="landing" />);
    expect(screen.getByRole('heading', { name: 'The Photo Reality Gap' })).toBeTruthy();
    expect(screen.getByText('The Myth of Exact Calories')).toBeTruthy();
    expect(screen.getByText('The FoodLens Honest Approach')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Built with Privacy and Restraint' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Zero Photo Storage' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Backend-Only Isolation' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Educational & Non-Medical' })).toBeTruthy();
  });

  it('navigates from landing page to analyzer workspace and back', () => {
    render(<App initialRoute="landing" />);
    expect(screen.queryByLabelText('Choose a food photo')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Launch FoodLens Analyzer/ }));
    expect(screen.getByLabelText('Choose a food photo')).toBeTruthy();
    expect(screen.getByRole('button', { name: '← Back to Overview' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '← Back to Overview' }));
    expect(screen.queryByLabelText('Choose a food photo')).toBeNull();
    expect(screen.getByRole('heading', { name: 'How FoodLens AI Works' })).toBeTruthy();
  });
});
