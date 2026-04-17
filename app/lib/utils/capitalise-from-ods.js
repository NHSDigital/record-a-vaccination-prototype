// Words that should remain lowercase (unless at the start)
const lowercaseWords = ['and', 'the', 'of', 'in', 'for', 'on', 'at', 'to', 'by', 'with', 'a', 'an'];

// Acronyms that should remain uppercase
const acronyms = ['NHS', 'GP', 'PCN', 'CCG', 'ICB', 'CIC', 'UK', 'LLP', 'PLC'];

module.exports.capitaliseFromOds = function(input) {
  if (!input) return input;

  const words = input.toLowerCase().split(/\s+/);

  const capitalisedWords = words.map((word, index) => {
    // Check if word is initials (e.g. "p.g." or "a.b.c.")
    if (/^([a-z]\.)+$/i.test(word)) {
      return word.toUpperCase();
    }

    // Check if word is a single letter (keep uppercase)
    if (/^[a-z]$/i.test(word)) {
      return word.toUpperCase();
    }

    // Check if upper-cased word is an acronym
    const upperWord = word.toUpperCase();
    if (acronyms.includes(upperWord)) {
      return upperWord;
    }

    // Check if word should remain lowercase (but not if it's the first word)
    if (index !== 0 && lowercaseWords.includes(word)) {
      return word;
    }

    // Capitalise first letter, rest lowercase
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return capitalisedWords.join(' ');
}
