import LoginForm from "../../components/LoginForm";

export const Home = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h1 className="mx-auto mb-4 font-raleway text-7xl text-white">Home</h1>

      <LoginForm onLogin={() => {}} onRegister={() => {}} />
    </div>
  );
};
