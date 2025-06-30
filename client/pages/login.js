import Head from 'next/head';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login - AI Tech Support Chatbot</title>
      </Head>

      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center"
          style={{
          backgroundImage: "url('/background.png')",
        }}
      >
        <div className="backdrop-blur-md bg-white/10 p-10 rounded-xl shadow-lg w-full max-w-md border border-white/30">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
