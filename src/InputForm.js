import './App.css';
import React from "react";
import {nanoid} from 'nanoid'
import fire from './firebase'
import 'firebase/firestore';

let yup = require('yup')

const firestore = fire.firestore();

const slugSchema = yup.object().shape( {
    slug: yup.string().trim().matches(/^[\w-]+$/i),
});

class InputForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {link: ''};
        this.state = {slug: ''};
        this.state = {error: null};
        this.state = {success: null};

        this.handleChangeLink = this.handleChangeLink.bind(this);
        this.handleChangeSlug = this.handleChangeSlug.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // handle changes in the input fields
    handleChangeLink(event) {
        this.setState({link: event.target.value})
    }

    handleChangeSlug(event) {
        this.setState({slug: event.target.value})
    }

    // handle  the submission of the form
    async handleSubmit(event) {

        // first we make sure the link is a valid URL
        let validUrl

        try{
            // eslint-disable-next-line no-unused-vars
            let url = new URL(this.state.link)
            validUrl = true
        } catch {
            this.setState({error: 'invalid URL'});
            validUrl = false
        }
        // check for a blank slug
        // if it's blank we create one
        if (this.state.slug === undefined) {
            await this.setState({slug: nanoid(5)});
        }

        this.setState({slug: this.state.slug.toLowerCase()})

        let validSlug = await slugSchema.isValid({slug: this.state.slug});
        if (!validSlug) {
            this.setState({error: 'invalid slug'})
        }

        if (validSlug && validUrl) {
            const usersRef = firestore.collection('shorturls').doc(this.state.slug)

            usersRef.get()
                .then((docSnapshot) => {
                    if (docSnapshot.exists) {
                        usersRef.onSnapshot(() => {
                            this.setState({error: 'This slug is already in use'});
                        });
                    } else {
                        usersRef.set({url: this.state.link});
                        this.setState({error: null});
                        this.setState({success:
                                'Short url created: Link: ' + this.state.link + ' Slug: ' + this.state.slug})
                    }
                });
        }
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <img className="logo" src="https://cdn.discordapp.com/attachments/453345490168315908/778109038353055784/logo.png" alt="null"/>
                {this.state.success === null ? null : <div className="success">{this.state.success}</div>}
                {this.state.error === undefined ? null : <div className="error">{this.state.error}</div>}
                <form className="form" onSubmit={this.handleSubmit}>
                    <input className="input" type="link"  value={this.state.link} onChange={this.handleChangeLink} placeholder="enter a url"/>
                    <div/>
                    <input className="input" type="slug"  value={this.state.slug} onChange={this.handleChangeSlug} placeholder="enter a slug"/>
                    <div/>
                    <input className="create" type="submit" value="create" />
                </form>
            </div>
        )
    }
}

export default InputForm;
