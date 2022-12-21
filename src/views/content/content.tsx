import React from 'react';
import { render } from 'react-dom';
import styles from './test.module.scss';

export function Button() {
    return (
        <button className={styles.button} onClick={() => alert('Button clicked!')}>
            Click me
        </button>
    );
}

let x = 1;

interface y {}

// render the button into the body

// create a new div element

const div = document.createElement('div');
div.id = 'root';

document.body.appendChild(div);

render(<Button />, div);
