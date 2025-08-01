/**
 * Semantic Document Custom Elements Handler
 * Registers and handles custom semantic HTML elements
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    
    // Define CommentStartRef custom element
    class CommentStartRef extends HTMLElement {
        connectedCallback() {
            const bid = this.getAttribute('bid');
            this.setAttribute('data-comment-start', bid);
            this.classList.add('comment-start-ref');
        }
    }
    
    // Define CommentEndRef custom element
    class CommentEndRef extends HTMLElement {
        connectedCallback() {
            const bid = this.getAttribute('bid');
            this.setAttribute('data-comment-end', bid);
            this.classList.add('comment-end-ref');
        }
    }
    
    // Define SuggestedDelete custom element
    class SuggestedDelete extends HTMLElement {
        connectedCallback() {
            const by = this.getAttribute('by');
            const dated = this.getAttribute('dated');
            
            this.classList.add('suggested-delete');
            
            // Add tooltip with metadata
            let title = 'Suggested deletion';
            if (by) title += ' by ' + by;
            if (dated) title += ' on ' + new Date(dated).toLocaleDateString();
            this.setAttribute('title', title);
        }
    }
    
    // Define SuggestedInsert custom element
    class SuggestedInsert extends HTMLElement {
        connectedCallback() {
            const by = this.getAttribute('by');
            const dated = this.getAttribute('dated');
            
            this.classList.add('suggested-insert');
            
            // Add tooltip with metadata
            let title = 'Suggested insertion';
            if (by) title += ' by ' + by;
            if (dated) title += ' on ' + new Date(dated).toLocaleDateString();
            this.setAttribute('title', title);
        }
    }
    
    // Define NoteRef custom element
    class NoteRef extends HTMLElement {
        connectedCallback() {
            const bid = this.getAttribute('bid');
            this.classList.add('note-ref');
            
            // Create reference number from bid (extract number if possible)
            let refNum = bid ? bid.replace(/[^0-9]/g, '') || '1' : '1';
            this.innerHTML = '<sup>[' + refNum + ']</sup>';
            
            // Add click handler to scroll to footnote
            this.addEventListener('click', () => {
                const footnote = document.querySelector(`footnote[bid="${bid}"]`);
                if (footnote) {
                    footnote.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                    // Add temporary highlight class for CSS to handle
                    footnote.classList.add('footnote-highlighted');
                    setTimeout(() => {
                        footnote.classList.remove('footnote-highlighted');
                    }, 2000);
                }
            });
        }
    }
    
    // Define Footnote custom element
    class Footnote extends HTMLElement {
        connectedCallback() {
            const bid = this.getAttribute('bid');
            this.classList.add('footnote');
            
            // Add footnote number
            let refNum = bid ? bid.replace(/[^0-9]/g, '') || '1' : '1';
            this.innerHTML = '<strong>[' + refNum + ']</strong> ' + this.innerHTML;
        }
    }
    
    // Register all custom elements
    try {
        customElements.define('commentstartref', CommentStartRef);
        customElements.define('commentendref', CommentEndRef);
        customElements.define('suggesteddelete', SuggestedDelete);
        customElements.define('suggestedinsert', SuggestedInsert);
        customElements.define('noteref', NoteRef);
        customElements.define('footnote', Footnote);
        
        console.log('Semantic document custom elements registered successfully');
    } catch (error) {
        console.error('Error registering custom elements:', error);
    }
    
    // Handle list paragraph numbering
    function enhanceListParagraphs() {
        const listParas = document.querySelectorAll('p[listParaNum]');
        listParas.forEach(para => {
            const listNum = para.getAttribute('listParaNum');
            para.classList.add('list-paragraph');
            para.setAttribute('data-list-num', listNum);
        });
    }
    
    // Handle bid attributes for better document navigation
    function enhanceBidElements() {
        const bidElements = document.querySelectorAll('[bid]');
        bidElements.forEach(element => {
            element.setAttribute('data-bid', element.getAttribute('bid'));
            element.classList.add('semantic-element');
        });
    }
    
    // Handle plainTextView attribute
    function handlePlainTextView() {
        const plainTextElements = document.querySelectorAll('[plainTextView]');
        plainTextElements.forEach(element => {
            const plainText = element.getAttribute('plainTextView');
            element.setAttribute('data-plain-text', plainText);
            element.classList.add('has-plain-text');
        });
    }
    
    // Initialize enhancements
    enhanceListParagraphs();
    enhanceBidElements();
    handlePlainTextView();
    
    // Add utility functions to window for external access
    window.SemanticDoc = {
        // Toggle comment visibility
        toggleComments: function(show = true) {
            const commentRefs = document.querySelectorAll('commentstartref, commentendref');
            commentRefs.forEach(ref => {
                if (show) {
                    ref.classList.add('comments-visible');
                } else {
                    ref.classList.remove('comments-visible');
                }
            });
        },
        
        // Get element by bid
        getByBid: function(bid) {
            return document.querySelector(`[bid="${bid}"]`);
        },
        
        // Get all footnotes
        getFootnotes: function() {
            return document.querySelectorAll('footnote');
        },
        
        // Get all suggested changes
        getSuggestedChanges: function() {
            return {
                deletions: document.querySelectorAll('suggesteddelete'),
                insertions: document.querySelectorAll('suggestedinsert')
            };
        },
        
        // Navigate to element by bid
        navigateToBid: function(bid) {
            const element = this.getByBid(bid);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                element.classList.add('navigation-target');
                setTimeout(() => {
                    element.classList.remove('navigation-target');
                }, 2000);
            }
        }
    };
    
    console.log('Semantic document functionality loaded');
});