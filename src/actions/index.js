export const NAVTABS_SWITCH = 'NAVTABS_SWITCH';
export const CHANGE_JS = 'CHANGE_JS';
export const CHANGE_INPUT = 'CHANGE_INPUT';
export const SWITCH_CANDIDATES = 'SWITCH_CANDIDATES';

export function switchTabs(index) {
    return {
        type: NAVTABS_SWITCH,
        index
    }
}

export function changeJs(js) {
    try {
        let js = JSON.parse(js);
        if (Object.prototype.toString.call(js) === '[object Array]') {
            js = js.join(';');
        }
    } catch (e) {}
    return {
        type: CHANGE_JS,
        js
    };
}

export function changeInput(data) {
    return {
        type: CHANGE_INPUT,
        ...data
    };
}

export function switchCandidates(data) {
    let { unifiedId } = data;
    return {
        type: SWITCH_CANDIDATES,
        unifiedId
    }
}
