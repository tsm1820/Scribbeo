const generateText = require('../popup-signedin');
//const firebase = require('../popup-signedin');
const signOut = require('../popup-signedin');

test('should output name and age', () => {
    const text = generateText('Max', 29);
    expect(text).toBe('Max and 29');
});


test('signing out', () => {
    const signout = signOut();
    expect(signout).toBe('Max and 29');
});