import logo from './assets/react-logo.png';

export default function Header() {
  return(
        <header className='header'>
        <div className='brand'>
      <img className='logo' src={logo} alt='logo' ></img>
      <span className='title'>ReactFacts</span>
      </div>
      <nav>
        <ul className="nav-list">
          <li className='nav-list-item'>Pricing</li>
          <li className='nav-list-item'>About</li>
          <li className='nav-list-item'>Contact</li>
        </ul>
      </nav>
    </header>
  )
}
