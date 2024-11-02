export const isElectron = () => {
    return Boolean(window && window.process && window.process.type); 
};