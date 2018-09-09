import React from 'react';
import {css} from 'glamor';
import Color from 'color';
import {remote} from 'electron';

const closeSvg = `
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z" fill="#000"/>
  </svg>
`;
const minimizeSvg = `
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4.399V5.5H0V4.399h11z" fill="#000"/>
  </svg>
`;
const maximizeSvg = `
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 0v11H0V0h11zM9.899 1.101H1.1V9.9h8.8V1.1z" fill="#000"/>
  </svg>
`;

const svgUrl = svg => `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}")`

const iconCss = (svg, iconStyle={}) => css({
  '& div': { mask: `${svgUrl(svg)} no-repeat 50% 50%`, ...iconStyle }
});

const styles = {
  buttons: css({
    height: 30,
    WebkitAppRegion: 'no-drag',
    display: 'flex',
    flexDirection: 'row',
    userSelect: 'none',
    cursor: 'default',
  }),
  button: css({
    width: 46,
    height: '100%',
    flex: '1 0 auto',
    ':hover': { backgroundColor: 'hsla(0, 0%, 100%, .1)' },
    ':active': { backgroundColor: 'hsla(0, 0%, 100%, .1)' },
    '& div': {
      width: '100%',
      height: '100%',
      backgroundColor: '#CCC9C2',
      maskSize: '23.1%',
    },
  }),
  minimize: iconCss(minimizeSvg),
  maximize: iconCss(maximizeSvg),
  close: css(iconCss(closeSvg), {
    ':hover': { backgroundColor: 'rgba(232, 17, 35, .9)' },
    ':active': { backgroundColor: 'rgba(232, 17, 35, 1)' },
    '& div': { ':hover, :active': { backgroundColor: '#FFFFFF' } },
  }),
};

export default function WindowsButtons({
  onMinimizeClick=minimize,
  onMaximizeClick=maximize,
  onCloseClick=close,
  hideMinimize=false,
  hideMaximize=false,
  hideClose=false,
  customButtons=[],
  color='#CCC9C2',
  ...rest
}={}) {
  const buttonStyle = css(styles.button, {
    ':hover': { backgroundColor: Color(color).alpha(0.2) },
    ':active': { backgroundColor: Color(color).alpha(0.3) },
    '& div': { backgroundColor: color },
  });

  return (
    <div {...styles.buttons} {...rest}>
      {customButtons.map(({icon,iconStyle,...props}, i) =>
        <div key={i} {...css(buttonStyle, iconCss(icon, iconStyle))} {...props}><div/></div>
      )}
      {hideMinimize || <div {...css(buttonStyle, styles.minimize)} onClick={onMinimizeClick}><div/></div>}
      {hideMaximize || <div {...css(buttonStyle, styles.maximize)} onClick={onMaximizeClick}><div/></div>}
      {hideClose || <div {...css(buttonStyle, styles.close)} onClick={onCloseClick}><div/></div>}
    </div>
  );
}

function minimize() {
  remote.getCurrentWindow().minimize();
}
function maximize() {
  const win = remote.getCurrentWindow();
  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
}
function close() {
  remote.getCurrentWindow().close();
}