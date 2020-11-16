import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {Route} from "react-router";
import {BrowserRouter as Router} from "react-router-dom";
import ReRoute from './Redirect'
import InputForm from "./InputForm";

ReactDOM.render(
  <React.StrictMode>
      <Router>
          <div>
              <Route path="/:repo" component={ReRoute} />
              <Route exact path="/" component={InputForm}/>
          </div>
      </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
