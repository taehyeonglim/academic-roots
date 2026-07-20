import { strings } from "../strings";

export function Header() {
  return (
    <header className="header">
      <div>
        <h1>{strings.appTitle}</h1>
        <p>{strings.appSubtitle}</p>
      </div>
    </header>
  );
}
