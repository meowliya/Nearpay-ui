import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

async function continueAsGuest() {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: /Continue as guest/ }));
  return user;
}

describe("NearPay frontend", () => {
  it("welcomes guests, discloses unavailable services, and supports navigation", async () => {
    const user = await continueAsGuest();
    expect(screen.getByText("Accounts and payments aren’t connected in this build.")).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: "Contacts" })[0]);
    expect(screen.getByRole("heading", { name: "Contacts" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Contacts" })[0]).toHaveAttribute("aria-current", "page");
  });

  it("reviews and confirms a local-only payment record", async () => {
    const user = await continueAsGuest();
    await user.click(screen.getByRole("button", { name: /Pay nearby/ }));
    fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "75" } });
    await user.click(screen.getByRole("button", { name: /Review payment/ }));
    expect(screen.getByRole("heading", { name: "Review before confirming" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Confirm payment" }));
    expect(screen.getByText("Activity for Azam was updated on this device.")).toBeInTheDocument();
    expect(screen.getByText(/Payments services aren’t connected|Payment services aren’t connected/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));
    await user.click(screen.getAllByRole("button", { name: "History" })[0]);
    expect(screen.getByText("−₹75")).toBeInTheDocument();
  });

  it("lets a user decline an incoming request", async () => {
    const user = await continueAsGuest();
    const request = screen.getByText(/Sidra requested/).closest(".incoming-request-row");
    expect(request).not.toBeNull();
    await user.click(within(request as HTMLElement).getByRole("button", { name: "Decline" }));
    expect(screen.queryByText(/Sidra requested/)).not.toBeInTheDocument();
  });

  it("renders a NearPay QR code and offers a manual scanner fallback", async () => {
    const user = await continueAsGuest();
    await user.click(screen.getByRole("button", { name: /Receive/ }));
    expect(screen.getByLabelText("Scannable NearPay code")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close dialog" }));

    await user.click(screen.getByRole("button", { name: /Scan a code/ }));
    await user.type(screen.getByLabelText("NearPay code"), "nearpay://pay/test");
    expect(screen.getByText(/Code ready to review/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Review code" }));
    expect(screen.getByRole("status")).toHaveTextContent("Payments aren’t connected");
  }, 10000);

  it("keeps sign-in local and explains it is not connected", async () => {
    const user = await continueAsGuest();
    await user.click(screen.getAllByRole("button", { name: "Profile" })[0]);
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    await user.type(screen.getByLabelText("Email address"), "guest@example.test");
    await user.type(screen.getByLabelText("Password"), "not-a-real-password");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByRole("status")).toHaveTextContent("Your details were not saved or sent");
  });

  it("explains when camera or Bluetooth features are unavailable", async () => {
    const user = await continueAsGuest();
    await user.click(screen.getByRole("button", { name: /Scan a code/ }));
    await user.click(screen.getByRole("button", { name: "Use camera to scan" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/Camera access is not available|does not support QR detection/);
    await user.click(screen.getByRole("button", { name: "Close dialog" }));

    await user.click(screen.getAllByRole("button", { name: "Profile" })[0]);
    await user.click(screen.getByRole("button", { name: /Bluetooth settings/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Bluetooth discovery is not supported");
  });

  it("closes dialogs on Escape and returns keyboard focus to the opener", async () => {
    const user = await continueAsGuest();
    const opener = screen.getByRole("button", { name: /Pay nearby/ });
    await user.click(opener);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it("signs out locally, clears the activity session, and returns to welcome", async () => {
    const user = await continueAsGuest();
    await user.click(screen.getByRole("button", { name: /Pay nearby/ }));
    fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "75" } });
    await user.click(screen.getByRole("button", { name: /Review payment/ }));
    await user.click(screen.getByRole("button", { name: "Confirm payment" }));
    await user.click(screen.getByRole("button", { name: "Done" }));

    await user.click(screen.getAllByRole("button", { name: "Profile" })[0]);
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    expect(screen.getByRole("heading", { name: "Welcome to NearPay" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Continue as guest/ }));
    await user.click(screen.getAllByRole("button", { name: "History" })[0]);
    expect(screen.queryByText("Payment")).not.toBeInTheDocument();
  });
});
