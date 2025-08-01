/**
 * Semantic Document Custom Elements Handler
 * Registers and handles custom semantic HTML elements
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    
    // Note: Custom element names must contain hyphens to be valid
    // Since your existing elements don't follow this rule, we'll enhance them directly
    
    // Handle existing custom elements (they don't follow kebab-case rule)
    // We'll enhance them directly instead of registering as custom elements
    function enhanceCustomElements() {
        // Handle commentStartRef elements
        document.querySelectorAll('commentStartRef').forEach(element => {
            const bid = element.getAttribute('bid');
            element.setAttribute('data-comment-start', bid);
            element.classList.add('comment-start-ref');
        });
        
        // Handle commentEndRef elements
        document.querySelectorAll('commentEndRef').forEach(element => {
            const bid = element.getAttribute('bid');
            element.setAttribute('data-comment-end', bid);
            element.classList.add('comment-end-ref');
        });
        
        // Handle suggestedDelete elements
        document.querySelectorAll('suggestedDelete').forEach(element => {
            const by = element.getAttribute('by');
            const dated = element.getAttribute('dated');
            
            element.classList.add('suggested-delete');
            
            let title = 'Suggested deletion';
            if (by) title += ' by ' + by;
            if (dated) title += ' on ' + new Date(dated).toLocaleDateString();
            element.setAttribute('title', title);
        });
        
        // Handle suggestedInsert elements
        document.querySelectorAll('suggestedInsert').forEach(element => {
            const by = element.getAttribute('by');
            const dated = element.getAttribute('dated');
            
            element.classList.add('suggested-insert');
            
            let title = 'Suggested insertion';
            if (by) title += ' by ' + by;
            if (dated) title += ' on ' + new Date(dated).toLocaleDateString();
            element.setAttribute('title', title);
        });
        
        // Handle noteref elements
        document.querySelectorAll('noteref').forEach(element => {
            const bid = element.getAttribute('bid');
            element.classList.add('note-ref');
            
            let refNum = bid ? bid.replace(/[^0-9]/g, '') || '1' : '1';
            element.innerHTML = '<sup>[' + refNum + ']</sup>';
            
            element.addEventListener('click', () => {
                const footnote = document.querySelector(`footnote[bid="${bid}"]`);
                if (footnote) {
                    footnote.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                    footnote.classList.add('footnote-highlighted');
                    setTimeout(() => {
                        footnote.classList.remove('footnote-highlighted');
                    }, 2000);
                }
            });
        });
        
        // Handle footnote elements
        document.querySelectorAll('footnote').forEach(element => {
            const bid = element.getAttribute('bid');
            element.classList.add('footnote');
            
            let refNum = bid ? bid.replace(/[^0-9]/g, '') || '1' : '1';
            element.innerHTML = '<strong>[' + refNum + ']</strong> ' + element.innerHTML;
        });
    }
    
    // Run the enhancement
    enhanceCustomElements();
    console.log('Semantic document custom elements enhanced successfully');
    
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
            const commentRefs = document.querySelectorAll('commentStartRef, commentEndRef');
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
                deletions: document.querySelectorAll('suggestedDelete'),
                insertions: document.querySelectorAll('suggestedInsert')
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