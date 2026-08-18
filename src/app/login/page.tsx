export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  return (
    <main className="login-wrap">
      <form method="POST" action="/api/login" className="login-box">
        <p className="ml">Player 1 · Insert password</p>
        <h1 className="login-title">
          CABRAL <b>GAMES</b>
        </h1>
        <span className="underbar" />
        {erro && <p className="login-error">Senha incorreta. Tente novamente.</p>}
        <div className="inbox">
          <label htmlFor="password">Senha de acesso</label>
          <input id="password" name="password" type="password" autoFocus required />
        </div>
        <button className="btn full" type="submit">
          Press Start
        </button>
      </form>
    </main>
  );
}
