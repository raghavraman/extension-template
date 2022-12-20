import React from 'react';
import { render } from 'react-dom';
import styles from './test.module.scss';

function Button() {
    return (
        <button className={styles.button} onClick={() => alert('Button clicked!')}>
            Click me
        </button>
    );
}

// render the button into the body

// create a new div element

const div = document.createElement('div');
div.id = 'root';

document.body.appendChild(div);

render(<Button />, div);
