import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AiPlateScanner from "../components/AiPlateScanner";

describe("AiPlateScanner", () => {
  it("renders idle plate illustration when not busy", () => {
    const { container } = render(<AiPlateScanner busy={false} />);
    expect(container.querySelector(".plate-idle-wrapper")).not.toBeNull();
    expect(container.querySelector(".plate-idle-svg")).not.toBeNull();
    expect(container.querySelector(".ai-plate-scanner")).toBeNull();
  });

  it("renders active AI vision scanner with live pipeline badge when busy", () => {
    const { container } = render(<AiPlateScanner busy={true} />);
    expect(container.querySelector(".ai-plate-scanner-wrapper")).not.toBeNull();
    expect(container.querySelector(".ai-plate-scanner")).not.toBeNull();
    expect(container.querySelector(".scanner-outer-ring")).not.toBeNull();
    expect(container.querySelector(".scanner-beam-line")).not.toBeNull();
    expect(screen.getByText("AI Vision Pipeline Active")).toBeTruthy();
  });
});
