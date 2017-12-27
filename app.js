import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import styles from './style.css'

const url = "https://api.cryptonator.com/api/ticker/";

class Calculator extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currenciesFiat: ["USD", "EUR", "GBP", "CAD"],
            currenciesCrypto: ["BTC", "LTC", "DOGE", "ETH"],
            selectedFiat: "usd",
            selectedCrypto: "btc",
            amountFiat: '',
            amountCrypto: '',
            rate: ''
        };

        this.updateRate(this.state.selectedFiat, this.state.selectedCrypto);

        this.handleSelectFaitChange = this.handleSelectFaitChange.bind(this);
        this.handleInputFaitChange = this.handleInputFaitChange.bind(this);
        this.handleSelectCryptoChange = this.handleSelectCryptoChange.bind(this);
        this.handleInputCryptoChange = this.handleInputCryptoChange.bind(this);
    }

    updateRate(selectedFiat, selectedCrypto, callback) {
        axios.get(url + selectedFiat + "-" + selectedCrypto)
            .then((response) => {
                this.setState({
                    rate: response.data.ticker.price,
                });
                if (callback) { callback(this); }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return <div>
            <div className="currency_container">
                <CurrencySelect currencies={this.state.currenciesCrypto} selected={this.state.selectedCrypto} onChange={this.handleSelectCryptoChange} />
                <AmountInput amount={this.state.amountCrypto} onChange={this.handleInputCryptoChange} />
            </div>
            <div className="currency_container right">
                <CurrencySelect currencies={this.state.currenciesFiat} selected={this.state.selectedFiat} onChange={this.handleSelectFaitChange} />
                <AmountInput amount={this.state.amountFiat} onChange={this.handleInputFaitChange} />
            </div>
        </div>
    }

    handleSelectFaitChange(event) {
        var select = event.target
        var selectedFiat = select.options[select.selectedIndex].value;
        this.updateRate(selectedFiat, this.state.selectedCrypto, function (_this) {
            _this.setState({
                amountCrypto: _this.state.amountFiat * _this.state.rate,
                selectedFiat: selectedFiat
            });
        });
    }

    handleInputFaitChange(event) {
        var amount = event.target.value;
        this.setState({
            amountFiat: amount,
            amountCrypto: amount * this.state.rate
        });
    }

    handleSelectCryptoChange(event) {
        var select = event.target
        var selectedCrypto = select.options[select.selectedIndex].value;
        this.updateRate(this.state.selectedFiat, selectedCrypto, function (_this) {
            _this.setState({
                amountFiat: _this.state.amountCrypto / _this.state.rate,
                selectedCrypto: selectedCrypto
            });
        });
    }

    handleInputCryptoChange(event) {
        var amount = event.target.value;
        this.setState({
            amountCrypto: amount,
            amountFiat: amount / this.state.rate
        });
    }
}

class AmountInput extends React.Component {
    render() {
        return <div><input type="number" value={parseFloat(this.props.amount).toFixed(6)} step="any" onChange={this.props.onChange} /></div>
    }
}

class CurrencySelect extends React.Component {
    render() {
        var options = this.props.currencies.map(function (currency, i) {
            return (
                <option key={i} value={currency}>{currency}</option>
            );
        });
        return <div>
            <select value={this.props.selected} onChange={this.props.onChange}>{options}</select><br />
        </div>
    }
}

ReactDOM.render(<Calculator />, document.getElementById('js-container'));