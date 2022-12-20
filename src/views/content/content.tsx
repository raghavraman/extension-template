// inject a new button into the document
import styles from './test.module.scss';

const button = document.createElement('button');
button.className = styles.button;
button.innerText = 'Click me';
button.onclick = () => {
    alert('Button clicked!');
};

console.log('Button added to the page');

document.body.appendChild(button);
