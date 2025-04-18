export function createQuestion(title, text, tag, clickAskQ, clickPostQ) {
    if (clickAskQ)
        cy.contains("Ask a Question").click();
    if (title)
        cy.get("#formTitleInput").type(title);
    if (text)
        cy.get("#formTextInput").type(text);
    if (tag)
        cy.get("#formTagInput").type(tag);
    if (clickPostQ)
        cy.contains("Post Question").click();
}

export function createAnswer(qtitle, text, clickPostA) {
    if (qtitle) {
        cy.contains(qtitle).click();
        cy.contains("Answer Question").click();
    }
    if (text)
        cy.get("#answerTextInput").type(text);
    if (clickPostA)
        cy.contains("Post Answer").click();
}
