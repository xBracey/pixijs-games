import { Story } from "@ladle/react";
import LoginForm from ".";

export const LoginFormStory: Story = () => (
  <LoginForm onLogin={() => {}} onRegister={() => {}} />
);

LoginFormStory.storyName = "LoginForm";
