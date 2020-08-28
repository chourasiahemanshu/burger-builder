import React, { Component } from 'react';
import Button from './../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true });
        const order = {
            ingredience: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'Hemanshu',
                address: {
                    street: 'Lincoln',
                    zipcode: '364000',
                    country: 'canada'
                },
                email: 'test@gmail.com'
            },
            deliveryMethod: 'fastes'
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: false });
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({ loading: false });
            });
    }

    render() {

        let form = (<form>
            <input className={classes.Input} type='text' name='name' placeholder='Enter your name' />
            <input className={classes.Input} type='email' name='email' placeholder='Enter your email' />
            <input className={classes.Input} type='text' name='street' placeholder='Street' />
            <input className={classes.Input} type='text' name='postal' placeholder='Postal Code' />
            <Button btnType='Success' clicked={this.orderHandler}>Order</Button>
        </form>);
        if(this.state.loading){
            form = <Spinner/>;
        }

        return (
            <div className={classes.ContactData}>
                <h4>
                    Enter Your Contact Data
            </h4>
                {form}
            </div>
        );
    }
}

export default ContactData;