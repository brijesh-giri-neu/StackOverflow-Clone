export function createQuestion(title, text, tag, username, clickAskQ, clickPostQ) {
    if (clickAskQ)
        cy.contains("Ask a Question").click();
    if (title)
        cy.get("#formTitleInput").type(title);
    if (text)
        cy.get("#formTextInput").type(text);
    if (tag)
        cy.get("#formTagInput").type(tag);
    if (username)
        cy.get("#formUsernameInput").type(username);
    if (clickPostQ)
        cy.contains("Post Question").click();
}

export function createAnswer(qtitle, username, text, clickPostA) {
    if (qtitle) {
        cy.contains(qtitle).click();
        cy.contains("Answer Question").click();
    }
    if (username)
        cy.get("#answerUsernameInput").type(username);
    if (text)
        cy.get("#answerTextInput").type(text);
    if (clickPostA)
        cy.contains("Post Answer").click();
}
