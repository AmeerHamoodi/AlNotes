const inlineMathUpdater = (content: string) => {
    return window.katex.renderToString(content);
};

export default inlineMathUpdater