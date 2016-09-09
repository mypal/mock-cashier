import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeJs } from '../actions';

class OnlineData extends Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.props.changeJs(e.target.value);
    }
    render() {
        return (
            <div>
                <a href="http://m.dper.com/apitest/index?apiName=loadunifiedcashier.bin" target="_blank">查询API接口</a>
                <form>
                    <div className="form-group">
                        <label htmlFor="localJs">JS代码</label>
                        <textarea className="form-control" id="localJs" rows="20" placeholder="请将JsRuleArray字段填入" onChange={this.handleChange} />
                    </div>
                </form>
            </div>
        );
    }
}

OnlineData.propTypes = {
};

function mapStateToProps() {
    return {
    }
}

export default connect(mapStateToProps, { changeJs })(OnlineData);
