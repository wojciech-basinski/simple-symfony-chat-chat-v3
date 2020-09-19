import React from 'react';
import ReactDOM from 'react-dom';
import '../css/app.css';

class App extends React.Component {
    constructor(props) {
        super(props);
    }
}

// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(
    <div>Hello World</div>,

    document.getElementById('root')
);
