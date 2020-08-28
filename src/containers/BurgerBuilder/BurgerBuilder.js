import React, { Component } from 'react';

import Aux from '../../hoc/Auxi';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummay';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';



const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        ingredients: null,
        totalPrice: 2,   //base price is set to this amount
        purchasable: false, //To check if the button can be pressed or not
        purchasing: false, // TO start the model for the display 
        loading: false
    }

    componentDidMount() {
        console.log(this.props);
        axios.get('https://burger-builder-9999.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ ingredients: response.data })
            }).catch(error => {});;
    }

    updatePurchaseState(ingredients) {
        // Here the  ingredients was not being fetched the most current one after the change so we had 
        //to mke change in the function so the latest ingredient state is being passed and worked upon simultaniously
        // const ingredients = { ...this.state.ingredients };

        // this is a greate function to remember and understand.. 
        // Here we are iterating on all the elements object of ingredient 
        // and them calulating the whole sum of total ingredience to see if we should enable the buy button... 
        // good use of reduce to get the summation of the whole object
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            }).reduce((sum, el) => {
                return sum + el;
            }, 0);

        this.setState({ purchasable: sum > 0 });

    }
    addIngredientsHandler = (type) => {
        // Always make a copy of the object so that to make sure your changes are being created 
        // and then update the state using that whole object. 
        // Always follow this method of updation everywhere !!!!
        const oldCount = this.state.ingredients[type];
        const newCount = oldCount + 1;
        let newIng = { ...this.state.ingredients };
        newIng[type] = newCount;

        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({ totalPrice: newPrice, ingredients: newIng });
        this.updatePurchaseState(newIng);
    };

    purchaseHandler = () => {
        this.setState({ purchasing: true });
    }

    removeIngredientsHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount > 0) {
            const newCount = oldCount - 1;
            let newIng = { ...this.state.ingredients };
            newIng[type] = newCount;

            const priceDeduction = INGREDIENT_PRICES[type];
            const oldPrice = this.state.totalPrice;
            const newPrice = oldPrice - priceDeduction;
            this.setState({ totalPrice: newPrice, ingredients: newIng });
            this.updatePurchaseState(newIng);

        }

    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
       
        const queryParams =[];
        for ( let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i)+'='+ encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price='+ this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname:'/checkout',
            search:'?'+ queryString
        });
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }




        let burger = <Spinner />
        let orderSummary = null;

        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        // disabled={this.disabledInfo}
                        ingredients={this.state.ingredients}
                        ingredientsAdded={this.addIngredientsHandler}
                        ingredientsRemoved={this.removeIngredientsHandler}
                        price={this.state.totalPrice}
                        purchasable={!this.state.purchasable}
                        ordered={this.purchaseHandler}

                    >
                    </BuildControls>

                </Aux>
            );

            orderSummary = <OrderSummary ingredients={this.state.ingredients}
                cancelFunction={this.purchaseCancelHandler}
                orderFunction={this.purchaseContinueHandler}
                totalPrice={this.state.totalPrice} />;

        }
        if (this.state.loading) {
            orderSummary = <Spinner />
        }

        // console.log(disabledInfo);
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);