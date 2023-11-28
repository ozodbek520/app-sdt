import { createGlobalStyle } from 'styled-components';


const GlobalStyle = createGlobalStyle`
  html {
    font-weight: normal;
    font-size: 100%;
  }

  body {
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    background-color: #202023;
    color: #EEEEEE;
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  @media (prefers-reduced-motion: no-preference) {
    html {
      scroll-behavior: smooth;
    }
  }

  img {
    height: auto;
    user-select: none;
  }

  img {
    height: auto;
    user-select: none;
  }


  button {
    cursor: pointer;
    color: inherit;
  }

  form {

    label {
      color: var(--tg-theme-link-color);
      font-size: 14px;
      line-height: 22px;
      font-weight: 400;
      margin-bottom: 12px;
    }

    .extra-message {
      display: inline-block;
      margin-bottom: 16px;
      cursor: pointer;

      &:hover {
        color: #0336ff;
      }
    }
  }

  a, button {
    touch-action: manipulation;
  }

  .icon {
    width: 1.25rem;
    height: 1.25rem;
    object-fit: contain;
  }

  .styled-btn {
    padding: 8px 12px;
    position: relative;
    white-space: nowrap;
    vertical-align: middle;
    outline: 2px solid transparent;
    outline-offset: 2px;
    line-height: 1.2;
    border-radius: 8px;
    font-weight: 600;
    transition-property: all;
    transition-duration: 0.2s;
    height: 40px;
    min-width: 40px;
    font-size: 16px;
    background: #80cbc4;
    color: #424242;
    text-decoration: none;
  }
  
  .styled-game-btn {
    background-color: #FFD33F;

    a {
      text-decoration: none;
      color: #000;
    }
  }


`;

export default GlobalStyle;
