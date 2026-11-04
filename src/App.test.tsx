import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

async function enterDemo() {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: /Explore the demo/ }));
  return user;
}

describe("NearPay frontend", () => {
  it("introduces the demo and supports navigation", async () => {
    const user = await enterDemo();
    expect(screen.getByText("Demo mode")).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: "Contacts" })[0]);
    expect(screen.getByRole("heading", { name: "Contacts" })).toBeInTheDocument();
  });

  it("reviews and confirms a local-only demo payment", async () => {
    const user = await enterDemo();
    await user.click(screen.getByRole("button", { name: /Pay nearby/ }));
    fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "75" } });
    await user.click(screen.getByRole("button", { name: /Review payment/ }));
    expect(screen.getByRole("heading", { name: "Review before confirming" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Confirm demo payment" }));
    expect(screen.getByText("Demo activity for Azam was updated.")).toBeInTheDocument();
    expect(screen.getByText(/No money was sent or received/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));
    await user.click(screen.getAllByRole("button", { name: "History" })[0]);
    expect(screen.getByText(/Demo payment/)).toBeInTheDocument();
  });

  it("lets a user decline an incoming demo request", async () => {
    const user = await enterDemo();
    const request = screen.getByText(/Sidra requested/).closest(".incoming-request-row");
    expect(request).not.toBeNull();
    await user.click(within(request as HTMLElement).getByRole("button", { name: "Decline" }));
    expect(screen.queryByText(/Sidra requested/)).not.toBeInTheDocument();
  });

  it("renders a real demo QR code and offers a manual scanner fallback", async () => {
    const user = await enterDemo();
    await user.click(screen.getByRole("button", { name: /Receive/ }));
    expect(screen.getByLabelText("Scannable NearPay demo QR code")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close dialog" }));

    await user.click(screen.getByRole("button", { name: /Scan a code/ }));
    await user.type(screen.getByLabelText("Demo code"), "nearpay-demo://pay/test");
    expect(screen.getByText(/Code ready to review/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Review code" }));
    expect(screen.getByRole("status")).toHaveTextContent("Code reviewed locally");
  });

  it("keeps sign-in local and explains it is not connected", async () => {
    const user = await enterDemo();
    await user.click(screen.getAllByRole("button", { name: "Profile" })[0]);
    await user.click(screen.getByRole("button", { name: "Sign in / create account" }));
    await user.type(screen.getByLabelText("Email address"), "demo@example.test");
    await user.type(screen.getByLabelText("Password"), "not-a-real-password");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByRole("status")).toHaveTextContent("Your details were not saved or sent");
  });

  it("explains when camera or Bluetooth features are unavailable", async () => {
    const user = await enterDemo();
    await user.click(screen.getByRole("button", { name: /Scan a code/ }));
    await user.click(screen.getByRole("button", { name: "Use camera to scan" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/Camera access is not available|does not support QR detection/);
    await user.click(screen.getByRole("button", { name: "Close dialog" }));

    await user.click(screen.getByRole("button", { name: /Find devices/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Bluetooth discovery is not supported");
  });
});
