import React from "react";
import {Redirect} from "react-router";
import fire from './firebase'
import 'firebase/firestore';

const firestore = fire.firestore();

class ReRoute extends React.Component {
    // default constructor for Components
    constructor(props) {
        super(props)

        this.state = {href: <div/>}
    }

    // when the component is mounted thru the index.js this is called
    componentDidMount() {
        // create the repo parameter that got passed on mount
        const { repo } = this.props.match.params
        // call the forward method and then re-render
        this.forward(repo.toLowerCase()).then(()=> this.render())
    }

    async forward(slug) {
        // set up the collection
        let slugRef = firestore.collection('shorturls').doc(slug);
        let doc = await slugRef.get();
        if (doc.exists) {
            // redirect by changing the window location
            // and render a "Redirecting"
            this.setState({href: <div><h1>Redirecting</h1></div>})
            window.location = doc.data().url;
        } else {
            // if that doc does not exist return to home page
            this.setState({href: <Redirect to="/"/>})
        }
    }

    // basic render method
    render() {
        return (
            <div className="redirect">
                {this.state.href}
            </div>
        )
    }
}

export default ReRoute;
