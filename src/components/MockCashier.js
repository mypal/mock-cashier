import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { changeInput, switchCandidates } from '../actions';
import JSONTree from 'react-json-tree';

class MockCashier extends Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleCandidates = this.handleCandidates.bind(this);
    }
    handleChange(e) {
        let target = e.target;
        let key = target.dataset.key, value = target.value;
        let split = value.split('.');
        if (isNaN(value) || value[0] == '.' || split.length > 2 || split.length > 1 && split[1].length > 2) {
            return;
        }
        this.props.changeInput({
            key, value
        });
    }

    handleCheck(e) {
        this.props.changeInput({
            key: 'list',
            unifiedId: e.target.dataset.id,
            value: e.target.checked
        });
    }

    handleCandidates(e, unifiedId) {
        this.props.switchCandidates({
            unifiedId
        });
    }

    renderMain() {
        const cashierParam = this.props.cashierParam, inputData = cashierParam.get('input');
        const result = cashierParam.get('result');

        return (
            <form style={{padding: '0 10px'}}>
                <div className="form-group">
                    <div className="input-group">
                        <div className="input-group-addon">消费总额：￥</div>
                        <input type="text" className="form-control" placeholder="消费总额" style={{textAlign: 'right'}} data-key="total" value={inputData.get('total')} onChange={this.handleChange} />
                    </div>
                </div>
                <div className="form-group">
                    <div className="input-group">
                        <div className="input-group-addon">不参与优惠金额：￥</div>
                        <input type="text" className="form-control" placeholder="不参与优惠金额" style={{textAlign: 'right'}} data-key="noDiscount" value={inputData.get('noDiscount')} onChange={this.handleChange} />
                    </div>
                </div>
                {
                    result.rule.selectedList && result.rule.selectedList.map((item) => {
                        let candidates = item.candidates;
                        return (
                            <div className="checkbox form-control" key={item.unifiedId}>
                                <div style={{width: '100%', paddingLeft: 0}}>
                                    <span style={{cursor: candidates ? 'pointer' : 'default'}} onClick={(e) => {candidates && this.handleCandidates(e, item.unifiedId)}}>{item.desc}</span>
                                    <span style={{right: '12px', position: 'absolute'}}>
                                            {item.discountAmountText || item.tipsText}
                                        <input type="checkbox" data-id={item.unifiedId} checked={item.selected ? 'checked' : ''} disabled={item.enabled ? '' : 'disabled'} style={{position: 'static', marginLeft: '5px'}} onChange={this.handleCheck} />
                                        </span>
                                </div>
                            </div>
                        )
                    })
                }

                <button type="button" className="btn btn-warning btn-block" style={{marginBottom: '15px'}}>应付{result.rule.finalAmount || 0}元</button>
            </form>
        );
    }

    renderCandidates() {
        const cashierParam = this.props.cashierParam,
            candidatesUnifiedId = cashierParam.getIn(['candidates', 'unifiedId']),
            result = cashierParam.get('result');
        const candidates = result.rule.selectedList.reduce((prev, item) => {
            return item.unifiedId == candidatesUnifiedId
            || item.candidates && item.candidates.some(can => can.unifiedId == candidatesUnifiedId)
                ? item.candidates
                : prev;
        }, null);

        return (
            <div>
                <nav className="navbar navbar-default navbar-static-top">
                    <div className="container">
                        <a href="#" className="navbar-brand" onClick={(e) => {this.handleCandidates(e, null)}}>
                            <span className="glyphicon glyphicon-chevron-left" aria-hidden="true">back</span>
                        </a>
                    </div>
                </nav>
                {
                    candidates && candidates.map((item) => {
                        return (
                            <div className="radio form-control" key={item.unifiedId}>
                                <div style={{width: '100%', paddingLeft: 0}}>
                                    <span style={{cursor: 'default'}}>{item.desc}</span>
                                    <span style={{right: '12px', position: 'absolute'}}>
                                        {item.discountAmountText || item.tipsText}
                                        <input type="radio" data-id={item.unifiedId} checked={item.selected ? 'checked' : ''} disabled={item.enabled ? '' : 'disabled'} style={{position: 'static', marginLeft: '5px'}} onChange={this.handleCheck} />
                                    </span>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        );
    }

    renderJsonTree() {
        const cashierParam = this.props.cashierParam;
        const result = cashierParam.get('result');
        return (
            <div>
                <div className="form-group form-control" style={{height: 'auto', maxHeight: '300px', overflow: 'scroll'}}>
                    <label>rule返回值：</label>
                    <JSONTree  data={result.rule} hideRoot={true} shouldExpandNode={() => true} />
                </div>
                <div className="form-group form-control" style={{height: 'auto', maxHeight: '300px', overflow: 'scroll'}}>
                    <label>getDPDiscountInitData返回值：</label>
                    <JSONTree  data={result.getDPDiscountInitData} hideRoot={true} shouldExpandNode={() => true} />
                </div>
            </div>
        );
    }

    render() {
        const candidatesUnifiedId = this.props.cashierParam.getIn(['candidates', 'unifiedId']);
        return (
            <div>
                <div className="col-md-6">
                    {candidatesUnifiedId ? this.renderCandidates() : this.renderMain()}
                </div>
                <div className="col-md-6">
                    {this.renderJsonTree()}
                </div>
            </div>
        );
    }
}

MockCashier.propTypes = {
    cashierParam: React.PropTypes.objectOf(Immutable.Map).isRequired
};

function mapStateToProps(state) {
    const cashierParam = state.cashierParam;
    return {
        cashierParam: cashierParam
    }
}

export default connect(mapStateToProps, { changeInput, switchCandidates })(MockCashier);
