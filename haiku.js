var request = require("request");
var fs = require("fs");
(function() {
    
    function generateHaiku(callback) {
        
        var subject;
        var subjectSyllables;
        
        var nounList;
        var adjectiveList1Syllable;
        var adjectiveList2Syllable;
        var adjectiveList3Syllable;
        var adjectiveList4Syllable;
        var verbList;
        var prepositionList1Syllable;
        var prepositionList2Syllable;
        var prepositionList3Syllable;
        
        var lineWithSubject;
        var line1;
        var line2;
        var line3;
        
        var haikuTense = verbTenses.present;
        
        fs.readFile('./data/words/nouns/nounlist.txt', 'utf8', function(err, contents) {
            if (err) {
                console.log(err);
            } else {
                // Parse the noun list and randomly choose a word to be the subject
                nounList = contents.split("\r\n");
                subject = nounList[Math.floor(Math.random()*nounList.length)];
                console.log(subject);
                
                // Make HTTP request to find number of syllables of subject
                request("https://api.datamuse.com/words?sp=" + subject + "&md=s", function(error, response, body) {
                    if (error) {
                        console.log(error);
                    } else {
                        var data = JSON.parse(body);
                        subjectSyllables = data[0]["numSyllables"];
                        console.log(subjectSyllables);
                        
                        // Decide which line of the haiku will have the subject in it
                        lineWithSubject = Math.floor(Math.random()*3 + 1);
                        
                        readAdjectiveList1();
                    }
                });
            }
        });
        
        // Read the contents of each word list and continue to the next
        
        function readAdjectiveList1() {
            fs.readFile('./data/words/adjectives/1syllableadjectives.txt', 'utf8', function(err, contents) {
                if (err) {
                    console.log(err);
                } else {
                    adjectiveList1Syllable = contents.split("\r\n");
                    readAdjectiveList2();
                }
            });    
        }
        function readAdjectiveList2() {
            fs.readFile('./data/words/adjectives/2syllableadjectives.txt', 'utf8', function(err, contents) {
                if (err) {
                    console.log(err);
                } else {
                    adjectiveList2Syllable = contents.split("\r\n");
                    readAdjectiveList3();
                }
            });
        }
        function readAdjectiveList3() {
            fs.readFile('./data/words/adjectives/3syllableadjectives.txt', 'utf8', function(err, contents) {
                if (err) {
                    console.log(err);
                } else {
                    adjectiveList3Syllable = contents.split("\r\n");
                    readAdjectiveList4();
                }
            });
        }
        function readAdjectiveList4() {
            fs.readFile('./data/words/adjectives/4syllableadjectives.txt', 'utf8', function(err, contents) {
                if (err) {
                    console.log(err);
                } else {
                    adjectiveList4Syllable = contents.split("\r\n");
                    readVerbList();
                }
            });
        }
        function readVerbList() {
            fs.readFile('./data/words/verbs/verbs.txt', 'utf8', function(err, contents) {
                if (err) {
                    console.log(err);
                } else {
                    verbList = contents.split("\r\n");
                    readPrepositionList1();
                }
            });
        }
        function readPrepositionList1() {
            fs.readFile('./data/words/prepositions/1syllableprepositions.txt', 'utf8', function(err, contents) {
                if (err) {
                    console.log(err);
                } else {
                    prepositionList1Syllable = contents.split("\n");
                    readPrepositionList2();
                }
            });
        }
        function readPrepositionList2() {
            fs.readFile('./data/words/prepositions/2syllableprepositions.txt', 'utf8', function(err, contents) {
                if (err) {
                    console.log(err);
                } else {
                    prepositionList2Syllable = contents.split("\n");
                    readPrepositionList3();
                }
            });
        }
        function readPrepositionList3() {
            fs.readFile('./data/words/prepositions/3syllableprepositions.txt', 'utf8', function(err, contents) {
                if (err) {
                    console.log(err);
                } else {
                    prepositionList3Syllable = contents.split("\n");
                    generateLine1();
                }
            });
        }
        
        
        function generateLine1() {
            if (lineWithSubject == 1) {
                if (subjectSyllables >= 5) {
                    line1 = capitalize(subject) + chanceToGetString([';',':','.','?','!'], 0.3);
                    
                    generateLine2();
                } 
                else if (subjectSyllables == 4) {
                    if (Math.random() > .5) {
                        var lineArray = [capitalize(getRandomAdjective(1))," ",subject,chanceToGetString([';',':','.','?','!'], 0.3)];
                        line1 = lineArray.join('');
                        
                        generateLine2();
                        return;
                    } else {
                        var lineArray = [capitalize(getRandomArticle(subject))," ",subject,chanceToGetString([';',':','.'], 0.3)];
                        line1 = lineArray.join('');
                        
                        generateLine2();
                        return;
                    }
                }
                else if (subjectSyllables == 3) {
                    num = Math.floor(Math.random() * 4);
                    if (num == 0) {
                    // article + 1-syl-adj + subject
                        var adj = getRandomAdjective(1);
                        lineArray = [capitalize(getRandomArticle(adj))," ",adj," ",subject]; 
                        line1 = lineArray.join('');
                        
                        generateLine2();
                        return;
                    }
                    else if (num == 1) {
                    // article + subject + 1-syl-present-verb
                        getRandomConjugatedVerb(1, verbTenses.present, subjects.third, false, function(verb) {
                            lineArray = [capitalize(getRandomArticle(subject))," ",subject," ",verb,chanceToGetString([';','.'], 0.3)];
                            line1 = lineArray.join('');
                            

                            generateLine2();
                            return;
                        });
                    }
                    else if (num == 2) {
                    // subject + 2-syl-present-participle
                        getRandomConjugatedVerb(2, verbTenses.present, subjects.third, false, function(verb) {
                            lineArray = [capitalize(subject)," ",verb,chanceToGetString([';',':','.','—'], 0.3)];
                            line1 = lineArray.join('');
                            
                            generateLine2();
                            return;
                        });
                    }
                    else if (num == 3) {
                    // 2-syl-adj + subject
                        lineArray = [capitalize(getRandomAdjective(2))," ",subject,chanceToGetString([';',':','.','?','!'], 0.3)];
                        line1 = lineArray.join('');
                        
                        generateLine2();
                        return;
                    }
                }
                else if (subjectSyllables == 2) {
                    num = Math.floor(Math.random() * 3);
                    if (num == 0) {
                    // article + 2-syl-adj + subject
                        var adj = getRandomAdjective(2);
                        lineArray = [capitalize(getRandomArticle(adj))," ",adj," ", subject,chanceToGetString([';','.','—'], 0.3)];
                        line1 = lineArray.join('');
                        
                        generateLine2();
                        return;
                    } 
                    else if (num == 1) {
                    // article + subject + 2-syl-present-verb
                        getRandomConjugatedVerb(2, verbTenses.present, subjects.third, false, function(verb){
                            lineArray = [capitalize(getRandomArticle(subject))," ",subject," ",verb,chanceToGetString([';','.','—'], 0.3)];
                            line1 = lineArray.join('');
                            
                            generateLine2();
                            return;
                        });
                    }
                    else if (num == 2) {
                    // subject + 1-syl-prep + 1-syl-article + 1-syl-related-noun
                        getRandomRelatedNoun(1, subject, function(noun) {
                            lineArray = [capitalize(subject)," ",getRandomPreposition(1)," ",getRandomArticle(noun)," ",noun,chanceToGetString([';','.','—'], 0.3)];
                            line1 = lineArray.join('');
                            
                            generateLine2();
                            return;
                        });
                    }
                }
                else if (subjectSyllables == 1) {
                    num = Math.floor(Math.random() * 2);
                    if (num == 0) {
                    // article + 1-syl-adj + subject + 2-syl-present-verb
                        getRandomConjugatedVerb(2,verbTenses.present,subjects.third,false,function(verb){
                            var adj = getRandomAdjective(1);
                            lineArray = [capitalize(getRandomArticle(adj))," ",adj," ",subject," ",verb,chanceToGetString([';','.','—'], 0.3)];
                            line1 = lineArray.join('');
                            
                            generateLine2();
                            return;
                        });
                    }
                    else if (num == 1) {
                    // 1-syl-adj + subject + 1-syl-prep + article + 1-syl-related-noun
                        getRandomRelatedNoun(1,subject,function(noun){
                            var adj = getRandomAdjective(1);
                            lineArray = [capitalize(adj)," ",subject," ",getRandomPreposition(1)," ",getRandomArticle(noun)," ",noun,chanceToGetString([';','.','—'], 0.3)];
                            line1 = lineArray.join('');
                            
                            generateLine2();
                            return;
                        });
                    
                    }
                }
            } else {
                // Unnecessary conditional
                if (subjectSyllables >= 0) {
                    // It + 1-syl-verb + 1-syl-prep + article + 1-syl-related-noun
                    var num = Math.floor(Math.random() * 6);
                    if (num == 0) {
                        getRandomConjugatedVerb(1, verbTenses.present, subjects.third, false, function(verb) {
                            getRandomRelatedNoun(1, subject, function(noun) {
                                line1 = "It " + verb + " " + getRandomPreposition(1) + " " + getRandomArticle(noun) + " " + noun + chanceToGetString([';','.','—'], 0.3);
                                generateLine2();
                            });
                        });
                    }
                    // 1-syl-prep + article + 2-syl-adj + 1-syl-related-noun
                    else if (num == 1) {
                        getRandomRelatedNoun(1, subject, function(noun) {
                            getRandomRelatedAdjective(2, noun, function(adj) {
                                line1 = capitalize(getRandomPreposition(1)) + " " + getRandomArticle(adj) + " " + adj + " " + noun + chanceToGetString([';','.','—'], 0.3);
                                generateLine2();
                            });
                            
                        });
                    }
                    // 1-syl-adj + 2-syl-related-noun + 2-syl-present-participle
                    else if (num == 2) {
                        getRandomRelatedNoun(2, subject, function(noun) {
                            getRandomRelatedAdjective(1, noun, function(adj) {
                                getRandomConjugatedVerb(2, verbTenses.presentParticiple, subjects.third, false, function (verb) {
                                    line1 = capitalize(adj) + " " + noun + " " + verb + chanceToGetString([';','.','—'], 0.3);
                                    generateLine2();
                                });
                            });
                        });
                    }
                    // 2-syl-present-participle + 1-syl-prep + article + 1-syl-related-noun
                    else if (num == 3) {
                        getRandomRelatedNoun(1, subject, function(noun) {
                            getRandomConjugatedVerb(2, verbTenses.presentParticiple, subjects.third, false, function(verb) {
                                line1 = capitalize(verb) + " " + getRandomPreposition(1) + " " + getRandomArticle(noun) + " " + noun + chanceToGetString([';','.','—'], 0.3);
                                generateLine2();
                            });
                        });
                    }
                    // 2-syl-prep + article + 2-syl-related-noun
                    else if (num == 4) {
                        getRandomRelatedNoun(2, subject, function(noun) {
                            line1 = capitalize(getRandomPreposition(2)) + " " + getRandomArticle(noun) + " " + noun + chanceToGetString([';','.','—'], 0.3);
            
                            generateLine2();
                        });
                    }
                    // 1-syl-adj + 1-syl-related-noun + 1-syl-present-verb + 2-syl-prep
                    else if (num == 5) {
                        getRandomRelatedNoun(1, subject, function(noun) {
                            getRandomConjugatedVerb(2, verbTenses.presentParticiple, subjects.third, false, function(verb) {
                                line1 = capitalize(verb) + " " + getRandomPreposition(1) + " " + getRandomArticle(noun) + " " + noun + chanceToGetString([';','.','—'], 0.3);
                                generateLine2();
                            });
                        });
                    }
                }
            }
            console.log(line1);
        }
        
        function generateLine2() {
            if (lineWithSubject == 2) {
                if (subjectSyllables >= 7) {
                    line2 = subject + chanceToGetString([';',':','.','?','!'], 0.3);
                    generateLine3();
                } 
                else if (subjectSyllables == 6) {
                    num = Math.floor(Math.random() * 2);
                    // article + subject
                    if (num == 0) {
                        line2 = getRandomArticle(subject) + " " + subject;
                        generateLine3();
                    }
                    // 1-syl-adj + subject
                    else if (num == 1) {
                        line2 = getRandomAdjective(1) + " " + subject;
                        generateLine3();
                    }
                }
                else if (subjectSyllables == 5) {
                    num = Math.floor(Math.random() * 3);
                    // article + 1-syl-adj + subject
                    if (num == 0) {
                        var adj = getRandomAdjective(1);
                        line2 = getRandomArticle(adj) + " " + adj + " " + subject;
                        generateLine3();
                    }
                    // article + subject + 1-syl-present-verb
                    else if (num == 1) {
                        getRandomConjugatedVerb(1, verbTenses.present, subjects.third, false, function (verb) {
                            line2 = getRandomArticle(subject) + " " + subject + " " + verb;
                            generateLine3();
                        });
                    }
                    // 1-syl-adj , 1-syl-adj + subject
                    else if (num == 2) {
                        line2 = getRandomAdjective(1) + ", " + getRandomAdjective(1) + " " + subject;
                        generateLine3();
                    }
                }
                else if (subjectSyllables == 4) {
                    num = (Math.floor(Math.random() * 3));
                    // 3-syl-adj + subject
                    if (num == 0) {
                        line2 = getRandomAdjective(3) + " " + subject;
                        generateLine3();
                    }
                    // 1-syl-prep + article + 1-syl-adj + subject
                    else if (num == 1){
                        adj = getRandomAdjective(1);
                        line2 = getRandomPreposition(1) + " " + getRandomArticle(adj) + " " + adj + " " + subject;
                        generateLine3();
                    }
                    // article + 1-syl-adj + 1-syl-adj + subject
                    else if (num == 2) {
                        adj = getRandomAdjective(1);
                        line2 = getRandomArticle(adj) + " " + adj + " " + getRandomAdjective(1) + " " + subject;
                        generateLine3();
                    }
                }
                else if (subjectSyllables == 3) {
                    num = Math.floor(Math.random() * 4);
                    // article + subject + 1-syl-prep + article + 1-syl-rel-noun
                    if (num == 0) {
                        getRandomRelatedNoun(1, subject, function(noun) {
                            line2 = getRandomArticle(subject) + " " + subject + " " + getRandomPreposition(1) + " " + getRandomArticle(noun) + " " + noun;
                            generateLine3();
                        });
                    }
                    // article + 1-syl-adj + subject + 2-syl-present-participle
                    else if (num == 1) {
                        getRandomConjugatedVerb(2, verbTenses.presentParticiple, subjects.third, false, function(verb) {
                            var adj = getRandomAdjective(1);
                            line2 = getRandomArticle(adj) + " " + adj + " " + subject + " " + verb;
                            generateLine3();
                        });
                    }
                    // 2-syl-present-participle , article + subject + 1-syl-present-verb
                    else if (num == 2) {
                        getRandomConjugatedVerb(2, verbTenses.presentParticiple, subjects.third, false, function(verb) {
                            getRandomConjugatedVerb(1, verbTenses.present, subjects.third, false, function(verb2) {
                                line2 = verb + ", " + getRandomArticle(subject) + " " + subject + " " + verb2;
                                generateLine3();
                            });
                        });
                    }
                    // article + 1-syl-adj , 2-syl-adj + subject
                    else if (num == 3) {
                        adj = getRandomAdjective(1);
                        line2 = getRandomArticle(adj) + " " + adj + ", " + getRandomAdjective(2) + " " + subject;
                        generateLine3();
                    }
                }
                else if (subjectSyllables == 2) {
                    num = Math.floor(Math.random() * 4);
                    // article + subject + 1-syl-present-verb + 1-syl-prep + article + 1-syl-rel-noun
                    if (num == 0) {
                        getRandomConjugatedVerb(1, verbTenses.present, subjects.third, false, function(verb){
                            getRandomRelatedNoun(1, subject, function(noun) {
                                line2 = getRandomArticle(subject) + " " + subject + " " + verb + " " + getRandomPreposition(1) + " " + getRandomArticle(noun) + " " + noun;
                                generateLine3();
                            });
                        });
                    } 
                    // subject + 2-syl-present-participle + "and" + 2-syl-present-participle
                    else if (num == 1) {
                        getRandomConjugatedVerb(2, verbTenses.presentParticiple, subjects.third, false, function(verb1){
                            getRandomConjugatedVerb(2, verbTenses.presentParticiple, subjects.third, false, function(verb2){
                                line2 = subject + " " + verb1 + " and " + verb2;
                                generateLine3();
                            });
                        });
                    }
                    // 2-syl-prep + article + 2-syl-adj + subject
                    else if (num == 2) {
                        adj = getRandomAdjective(2);
                        line2 = getRandomPreposition(2) + " " + getRandomArticle(adj) + " " + adj + " " + subject;
                        generateLine3();
                    }
                    // 2-syl-present-participle + 1-syl-prep + article + 1-syl-adj + subject
                    else if (num == 3) {
                        getRandomConjugatedVerb(2, verbTenses.presentParticiple, subjects.third, false, function(verb){
                            var adj = getRandomAdjective(1);
                            line2 = verb + " " + getRandomPreposition(1) + " " + getRandomArticle(adj) + " " + adj + " " + subject;
                            generateLine3();
                        });
                    }
                }
                else if (subjectSyllables == 1) {
                    num = Math.floor(Math.random() * 2);
                    // 2-syl-present-participle + article + subject + 1-syl-prep + article + 1-syl-rel-noun
                    if (num == 0) {
                        getRandomConjugatedVerb(2, verbTenses.presentParticiple, subjects.third, false, function(verb) {
                            getRandomRelatedNoun(1, subject, function(noun) {
                                line2 = verb + " " + getRandomArticle(subject) + " " + subject + " " + getRandomPreposition(1) + " " + getRandomArticle(noun) + " " + noun;
                                generateLine3();
                            });
                        });
                    }
                    // article + 1-syl-adj + subject + 1-syl-prep + article + 2-syl-rel-noun
                    else if (num == 1) {
                        getRandomRelatedNoun(2, subject, function(noun) {
                                var adj = getRandomAdjective(1);
                                line2 = getRandomArticle(adj) + " " + adj + " " + subject + " " + getRandomPreposition(1) + " " + getRandomArticle(noun) + " " + noun;
                                generateLine3();
                        });
                    }
                    // article + subject + 1-syl-present-verb + 1-syl-prep + article + 2-syl-rel-noun
                    else if (num == 2) {
                        getRandomConjugatedVerb(1, verbTenses.present, subjects.third, false, function(verb){
                            getRandomRelatedNoun(2, subject, function(noun) {
                                line2 = getRandomArticle(subject) + " " + subject + " " + verb + " " + getRandomPreposition(1) + " " + getRandomArticle(noun) + " " + noun;
                                generateLine3();
                            });
                        });
                    } 
                    // 2-syl-adj + subject ; article + 1-syl-adj + 1-syl-rel-noun
                    else if (num == 3) {
                        getRandomRelatedNoun(1, subject, function(noun) {
                                var adj = getRandomAdjective(1);
                                line2 = getRandomAdjective(2) + " " + subject + "; " + getRandomArticle(adj) + " " + adj + " " + noun;
                                generateLine3();
                        });
                    }
                }
            } else {
                var num = Math.floor(Math.random() * 6);
                // 
                if (num == 0) {
                    getRandomRelatedNoun(2, subject, function(subjectReplacement){
                        getRandomConjugatedVerb(1, verbTenses.present, subjects.third, false, function(verb){
                            getRandomRelatedNoun(1, subject, function(noun) {
                                line2 = getRandomArticle(subjectReplacement) + " " + subjectReplacement + " " + verb + " " + getRandomPreposition(1) + " " + getRandomArticle(noun) + " " + noun;
                                generateLine3();
                            });
                        });
                    });
                }
                // 
                else if (num == 1) {
                    getRandomRelatedNoun(2, subject, function(subjectReplacement){
                        getRandomConjugatedVerb(2, verbTenses.presentParticiple, subjects.third, false, function(verb1){
                            getRandomConjugatedVerb(2, verbTenses.presentParticiple, subjects.third, false, function(verb2){
                                line2 = subjectReplacement + " " + verb1 + " and " + verb2;
                                generateLine3();
                            });
                        });
                    });
                }
                // 
                else if (num == 2) {
                    getRandomRelatedNoun(2, subject, function(subjectReplacement){
                        adj = getRandomAdjective(2);
                        line2 = getRandomPreposition(2) + " " + getRandomArticle(adj) + " " + adj + " " + subjectReplacement;
                        generateLine3();
                    });
                }
                // 
                else if (num == 3) {
                    getRandomRelatedNoun(2, subject, function(subjectReplacement){
                        getRandomConjugatedVerb(2, verbTenses.presentParticiple, subjects.third, false, function(verb){
                            var adj = getRandomAdjective(1);
                            line2 = verb + " " + getRandomPreposition(1) + " " + getRandomArticle(adj) + " " + adj + " " + subjectReplacement;
                            generateLine3();
                        });
                    });
                }
                // 
                else if (num == 4) {
                    getRandomRelatedNoun(2, subject, function(subjectReplacement){
                        getRandomConjugatedVerb(2, verbTenses.presentParticiple, subjects.third, false, function(verb){
                            var adj = getRandomAdjective(1);
                            line2 = verb + " " + getRandomPreposition(1) + " " + getRandomArticle(adj) + " " + adj + " " + subjectReplacement;
                            generateLine3();
                        });
                    });
                }
                // 
                else if (num == 5) {
                    getRandomRelatedNoun(1, subject, function(subjectReplacement){
                        getRandomRelatedNoun(2, subject, function(noun) {
                            var adj = getRandomAdjective(1);
                            line2 = getRandomArticle(adj) + " " + adj + " " + subjectReplacement + " " + getRandomPreposition(1) + " " + getRandomArticle(noun) + " " + noun;
                            generateLine3();
                        });
                    });
                }
            }
        }
        
        function generateLine3() {
            if (lineWithSubject == 3) {
                if (subjectSyllables >= 5) {
                    line3 = subject;
                    
                    passBackHaiku();
                } 
                else if (subjectSyllables == 4) {
                    if (Math.random() > .5) {
                        var lineArray = [getRandomAdjective(1)," ",subject];
                        line3 = lineArray.join('');
                        
                        passBackHaiku();
                        return;
                    } else {
                        lineArray = [getRandomArticle(subject)," ",subject];
                        line3 = lineArray.join('');
                        
                        passBackHaiku();
                        return;
                    }
                }
                else if (subjectSyllables == 3) {
                    num = Math.floor(Math.random() * 4);
                    if (num == 0) {
                    // article + 1-syl-adj + subject
                        var adj = getRandomAdjective(1);
                        lineArray = [getRandomArticle(adj)," ",adj," ",subject]; 
                        line3 = lineArray.join('');
                        
                        passBackHaiku();
                        return;
                    }
                    else if (num == 1) {
                    // article + subject + 1-syl-present-verb
                        getRandomConjugatedVerb(1, verbTenses.present, subjects.third, false, function(verb) {
                            lineArray = [getRandomArticle(subject)," ",subject," ",verb];
                            line3 = lineArray.join('');
                            

                            passBackHaiku();
                            return;
                        });
                    }
                    else if (num == 2) {
                    // subject + 2-syl-present-participle
                        getRandomConjugatedVerb(2, verbTenses.present, subjects.third, false, function(verb) {
                            lineArray = [subject," ",verb];
                            line3 = lineArray.join('');
                            
                            passBackHaiku();
                            return;
                        });
                    }
                    else if (num == 3) {
                    // 2-syl-adj + subject
                        lineArray = [getRandomAdjective(2)," ",subject];
                        line3 = lineArray.join('');
                        
                        passBackHaiku();
                        return;
                    }
                }
                else if (subjectSyllables == 2) {
                    num = Math.floor(Math.random() * 3);
                    if (num == 0) {
                    // article + 2-syl-adj + subject
                        var adj = getRandomAdjective(2);
                        lineArray = [getRandomArticle(adj)," ",adj," ", subject];
                        line3 = lineArray.join('');
                        
                        passBackHaiku();
                        return;
                    } 
                    else if (num == 1) {
                    // article + subject + 2-syl-present-verb
                        getRandomConjugatedVerb(2, verbTenses.present, subjects.third, false, function(verb){
                            lineArray = [getRandomArticle(subject)," ",subject," ",verb];
                            line3 = lineArray.join('');
                            
                            passBackHaiku();
                            return;
                        });
                    }
                    else if (num == 2) {
                    // subject + 1-syl-prep + 1-syl-article + 1-syl-related-noun
                        getRandomRelatedNoun(1, subject, function(noun) {
                            lineArray = [subject," ",getRandomPreposition(1)," ",getRandomArticle(noun)," ",noun];
                            line3 = lineArray.join('');
                            
                            passBackHaiku();
                            return;
                        });
                    }
                }
                else if (subjectSyllables == 1) {
                    num = Math.floor(Math.random() * 2);
                    if (num == 0) {
                    // article + 1-syl-adj + subject + 2-syl-present-verb
                        getRandomConjugatedVerb(2,verbTenses.present,subjects.third,false,function(verb){
                            var adj = getRandomAdjective(1);
                            lineArray = [getRandomArticle(adj)," ",adj," ",subject," ",verb];
                            line3 = lineArray.join('');
                            
                            passBackHaiku();
                            return;
                        });
                    }
                    else if (num == 1) {
                    // 1-syl-adj + subject + 1-syl-prep + article + 1-syl-related-noun
                        getRandomRelatedNoun(1,subject,function(noun){
                            var adj = getRandomAdjective(1);
                            lineArray = [adj," ",subject," ",getRandomPreposition(1)," ",getRandomArticle(noun)," ",noun];
                            line3 = lineArray.join('');
                            
                            passBackHaiku();
                            return;
                        });
                    
                    }
                }
            } else {
                // Unnecessary conditional
                if (subjectSyllables >= 0) {
                    // It + 1-syl-verb + 1-syl-prep + article + 1-syl-related-noun
                    var num = Math.floor(Math.random() * 6);
                    if (num == 0) {
                        getRandomConjugatedVerb(1, verbTenses.present, subjects.third, false, function(verb) {
                            getRandomRelatedNoun(1, subject, function(noun) {
                                line3 = "it " + verb + " " + getRandomPreposition(1) + " " + getRandomArticle(noun) + " " + noun;
                                passBackHaiku();
                            });
                        });
                    }
                    // 1-syl-prep + article + 2-syl-adj + 1-syl-related-noun
                    else if (num == 1) {
                        getRandomRelatedNoun(1, subject, function(noun) {
                            getRandomRelatedAdjective(2, noun, function(adj) {
                                line3 = getRandomPreposition(1) + " " + getRandomArticle(adj) + " " + adj + " " + noun;
                                passBackHaiku();
                            });
                            
                        });
                    }
                    // 1-syl-adj + 2-syl-related-noun + 2-syl-present-participle
                    else if (num == 2) {
                        getRandomRelatedNoun(2, subject, function(noun) {
                            getRandomRelatedAdjective(1, noun, function(adj) {
                                getRandomConjugatedVerb(2, verbTenses.presentParticiple, subjects.third, false, function (verb) {
                                    line3 = adj + " " + noun + " " + verb;
                                    passBackHaiku();
                                });
                            });
                        });
                    }
                    // 2-syl-present-participle + 1-syl-prep + article + 1-syl-related-noun
                    else if (num == 3) {
                        getRandomRelatedNoun(1, subject, function(noun) {
                            getRandomConjugatedVerb(2, verbTenses.presentParticiple, subjects.third, false, function(verb) {
                                line3 = verb + " " + getRandomPreposition(1) + " " + getRandomArticle(noun) + " " + noun;
                                passBackHaiku();
                            });
                        });
                    }
                    // 2-syl-prep + article + 2-syl-related-noun
                    else if (num == 4) {
                        getRandomRelatedNoun(2, subject, function(noun) {
                            line3 = getRandomPreposition(2) + " " + getRandomArticle(noun) + " " + noun;
            
                            passBackHaiku();
                        });
                    }
                    // 1-syl-adj + 1-syl-related-noun + 1-syl-present-verb + 2-syl-prep
                    else if (num == 5) {
                        getRandomRelatedNoun(1, subject, function(noun) {
                            getRandomConjugatedVerb(2, verbTenses.presentParticiple, subjects.third, false, function(verb) {
                                line3 = verb + " " + getRandomPreposition(1) + " " + getRandomArticle(noun) + " " + noun;
                                passBackHaiku();
                            });
                        });
                    }
                }
            }
        }
        
        function passBackHaiku() {
            line1 = line1.trim();
            line2 = line2.trim();
            line3 = line3.trim();
            
            line2 = capitalizeIfEndOfSentence(line2, line1);
            line3 = capitalizeIfEndOfSentence(line3, line2);
            
            if (line1.charAt(line1.length - 1) == '.' || line1.charAt(line1.length - 1) == ';' || line1.charAt(line1.length - 1) == '?') {
                line3 += '.';
            }
            
            console.log(line1);
            console.log(line2);
            console.log(line3);
            
            callback(line1, line2, line3);
            
        }
        
        function getRandomAdjective(numberOfSyllables) {
            console.log("getRandomAdjective called");
            switch (numberOfSyllables) {
                case 1:
                    return adjectiveList1Syllable[Math.floor(Math.random() * adjectiveList1Syllable.length)];
                case 2:
                    return adjectiveList2Syllable[Math.floor(Math.random() * adjectiveList2Syllable.length)];
                case 3:
                    return adjectiveList3Syllable[Math.floor(Math.random() * adjectiveList3Syllable.length)];
                case 4:
                    return adjectiveList4Syllable[Math.floor(Math.random() * adjectiveList4Syllable.length)];
                default:
                    console.log("invalid number of syllables");
                    return null;
            }
        }
        
        function getRandomRelatedAdjective(numberOfSyllables, noun, callback) {
            console.log("getRandomRelatedAdjective called");
            request("https://api.datamuse.com/words?rel_jjb=" + noun + "&md=s", function(error, response, body) {
                var data = JSON.parse(body);
                
                // Return a random adjective if no data is available
                if (!data[0]) {
                    console.log("Empty JSON body recieved in getRandomRelatedAdjective for \"" + noun + "\"");
                    callback(getRandomAdjective(numberOfSyllables));
                    return;
                }
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i]["numSyllables"] != numberOfSyllables) {
                        data.splice(i, 1);
                    }
                }
                // Return a random adjective if no data is available (again)
                if (!data[0]) {
                    console.log("No suitable results found in getRandomRelatedAdjective for \"" + noun + "\"");
                    callback(getRandomAdjective(numberOfSyllables));
                    return;
                }
                
                var index = Math.floor(Math.random() * data.length);
                var newAdjectiveSyllables = data[index]["numSyllables"];
                var newAdjective = data[index]["word"];
                
                if (newAdjectiveSyllables == numberOfSyllables) {
                    callback(newAdjective);
                } else {
                    // Try another call if number of syllables is incorrect
                    console.log("Removing adjectives with wrong number of syllables failed, apparently");
                    getRandomRelatedAdjective(numberOfSyllables, noun, callback);
                }
            });
        } 
        
        function getRandomVerb(numberOfSyllables, callback) {
            console.log("getRandomVerb called");
            
            var verb = verbList[Math.floor(Math.random() * verbList.length)];
            
            request("https://api.datamuse.com/words?sp=" + verb + "&md=s", function(error, response, body) {
                var data = JSON.parse(body);
                var verbSyllables = data[0]["numSyllables"];
                
                if (verbSyllables == numberOfSyllables) {
                    callback(verb);
                } else {
                    getRandomVerb(numberOfSyllables, callback);
                }
            });

        }
        
        function getRandomConjugatedVerb(numberOfSyllables, verbTense, verbSubject, isPlural, callback) {
            console.log("getRandomConjugatedVerb called");
            
            var verb = verbList[Math.floor(Math.random() * verbList.length)];
            verb = conjugateVerb(verb, verbTense, verbSubject, isPlural);
            
            request("https://api.datamuse.com/words?sp=" + verb + "&md=s", function(error, response, body) {
                var data = JSON.parse(body);
                
                if (!data[0]) {
                    getRandomConjugatedVerb(numberOfSyllables, verbTense, verbSubject, isPlural, callback);
                    return;
                }
                var verbSyllables = data[0]["numSyllables"];
                
                if (verbSyllables == numberOfSyllables) {
                    console.log("getRandomConjugatedVerb returning: " + verb);
                    callback(verb);
                } else {
                    getRandomConjugatedVerb(numberOfSyllables, verbTense, verbSubject, isPlural, callback);
                    return;
                }
            });

        }
        
        function getRandomNoun(numberOfSyllables, callback) {
            console.log("getRandomNoun called");
            var noun = nounList[Math.floor(Math.random()*nounList.length)];
            request("https://api.datamuse.com/words?sp=" + noun + "&md=s", function(error, response, body) {
                var data = JSON.parse(body);
                if (!data[0]) {
                    console.log("Recieved empty JSON body for getRandomNoun, word: \"" + noun + "\"");
                    getRandomNoun(numberOfSyllables, callback);
                    return;
                }
                var nounSyllables = data[0]["numSyllables"];
                
                if (nounSyllables == numberOfSyllables) {
                    callback(noun);
                } else {
                    getRandomNoun(numberOfSyllables, callback);
                }
            });
        }
        
        function getRandomRelatedNoun(numberOfSyllables, word, callback) {
            console.log("getRandomRelatedNoun called");
            
            var apiCodes = ["syn","spc"];
            var codeToUse = apiCodes[Math.floor(Math.random() * apiCodes.length)];
            request("https://api.datamuse.com/words?rel_" + codeToUse + "=" + word + "&md=s", function(error, response, body) {
                var data = JSON.parse(body);
                // Try another call if no data is available
                if (!data[0]) {
                    console.log("empty JSON body recieved");
                    getRandomNoun(numberOfSyllables, callback);
                    return;
                }
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i]["numSyllables"] != numberOfSyllables) {
                        data.splice(i, 1);
                    }
                }
                // Return a random noun if no data is available (again)
                if (!data[0]) {
                    console.log("No suitable results found in getRandomRelatedNoun for \"" + word + "\"");
                    getRandomNoun(numberOfSyllables, callback);
                    return;
                }
                var index = Math.floor(Math.random() * data.length);
                var newNounSyllables = data[index]["numSyllables"];
                var newNoun = data[index]["word"];
                
                // Try another call if number of syllables is incorrect
                if (newNounSyllables == numberOfSyllables) {
                    callback(newNoun);
                    return;
                } else {
                    getRandomRelatedNoun(numberOfSyllables, word, callback);
                    return;
                }
            });
        }
        
        function getRandomPreposition(numberOfSyllables) {
            console.log("getRandomPreposition called");
            switch(numberOfSyllables) {
                case 1:
                    return prepositionList1Syllable[Math.floor(Math.random() * prepositionList1Syllable.length)];
                case 2:
                    return prepositionList2Syllable[Math.floor(Math.random() * prepositionList2Syllable.length)];
                case 3:
                    return prepositionList3Syllable[Math.floor(Math.random() * prepositionList3Syllable.length)];
                default:
                    console.log("invalid number of syllables");
                    return null;
            }
        }
        
        function getRandomArticle(word) {
            console.log("getRandomArticle called");
            if (Math.random() > .5) {
                return "the";
            } else {
                return getIndefiniteArticle(word);
            }
        }
        
        function getIndefiniteArticle(word) {
            console.log("getIndefiniteArticle called");
            if (vowels.includes(word.charAt(0))) {
                return "an";
            } else {
                return "a";
            }
        }
        
        function chanceToGetString(stringArray, probabilityInOne) {
            console.log("chanceToGetString called");
            if (Math.random() > probabilityInOne) {
                return "";
            } else {
                return stringArray[Math.floor(Math.random() * stringArray.length)];
            }
        } 
    }
    
    function conjugateVerb(infinitive, verbTense, subject, isPlural) {
        
        var conjugatedVerb = infinitive;
        
        function setCharAt(str, index, chr) {
            var endOfString;
            if (index > str.length - 1) return str;
            if (index == -1) {
                endOfString = "";
            } else {
                endOfString = str.slice(index + 1);
            }
            return str.slice(0, index) + chr + endOfString;
        }
        
        
        if (verbTense == verbTenses.present) {
            if (subject == subjects.third) {
                if (infinitive.slice(-1) == "s" || 
                infinitive.slice(-1) == "x" || 
                infinitive.slice(-1) == "z" ||
                infinitive.slice(-2) == "ch" ||
                infinitive.slice(-2) == "sh") {
                    conjugatedVerb += "es";
                }
                else if (vowels.includes(infinitive.slice(-2, -1)) &&
                consonants.includes(infinitive.slice(-1)) &&
                !vowels.includes(infinitive.slice(-3, -2))) {
                    conjugatedVerb += "s";
                } 
                else if (infinitive.slice(-1) == "y") {
                    conjugatedVerb = setCharAt(conjugatedVerb, -1, "i");
                    conjugatedVerb += "es";
                } 
                else {
                    conjugatedVerb += "s";
                }
            }
        } // Present participle
        else if (verbTense == verbTenses.presentParticiple) {
            if (infinitive.slice(-1) == "y") {
                conjugatedVerb += "ing";
            }
            else if (vowels.includes(infinitive.slice(-2, -1)) &&
            consonants.includes(infinitive.slice(-1)) &&
            !vowels.includes(infinitive.slice(-3, -2)) &&
            infinitive.slice(-1) != 'w') {
                conjugatedVerb += conjugatedVerb.slice(-1);
                conjugatedVerb += "ing";
            }
            else if (infinitive.slice(-1) == "e") {
                conjugatedVerb = setCharAt(infinitive, -1, 'i');
                conjugatedVerb += "ng";
            }
            else {
                conjugatedVerb += "ing";
            }
    
        } 
        else if (verbTense == verbTenses.past) {
            if (vowels.includes(infinitive.slice(-2, -1)) &&
            consonants.includes(infinitive.slice(-1)) &&
            !vowels.includes(infinitive.slice(-3, -2))) {
                conjugatedVerb += conjugatedVerb.slice(-1);
                conjugatedVerb += "ed";
            }
            else if (infinitive.slice(-1) == "y") {
                conjugatedVerb = setCharAt(conjugatedVerb, -1, "i");
                conjugatedVerb += "ed";
            } 
            else if (infinitive.slice(-1) == "e") {
                conjugatedVerb += "d";
            } 
            else {
                conjugatedVerb += "ed"
            }
            
        } 
        else if (verbTense == verbTenses.pastParticiple) {
            if (vowels.includes(infinitive.slice(-2, -1)) && // Second to last is a vowel
            consonants.includes(infinitive.slice(-1)) &&     // Last is a consonant
            !vowels.includes(infinitive.slice(-3, -2))) {    // Third to last is a consonant
                conjugatedVerb += conjugatedVerb.slice(-1);
                conjugatedVerb += "ed";
            }
            else if (infinitive.slice(-1) == "y") {
                conjugatedVerb = setCharAt(conjugatedVerb, -1, "i");
                conjugatedVerb += "ed";
            } 
            else if (infinitive.slice(-1) == "e") {
                conjugatedVerb += "d";
            }
            else {
                conjugatedVerb += "ed"
            }
        }
        return conjugatedVerb;
    }
    
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    function capitalizeIfEndOfSentence(stringToCapitalize, stringToCheck) {
        if (stringToCheck.charAt(stringToCheck.length-1) == '.' || stringToCheck.charAt(stringToCheck.length-1) == '!' || stringToCheck.charAt(stringToCheck.length-1) == '?') {
            return capitalize(stringToCapitalize);
        } else {
            return stringToCapitalize;
        }
    }
    
    function getSyllables(word, callback) {
        var syllableCount;
        console.log("getSyllables called");
        request("https://api.datamuse.com/words?sp=" + word + "&md=s", function(error, response, body) {
           if (error) {
               console.log(error);
           } else {
               console.log("syllableCount: " + syllableCount);
               syllableCount = parseInt(JSON.parse(body[0]["numSyllables"]));
               callback(syllableCount);
           }
        });
    } // Not used, doesn't work
    
    // Enumerations for tense, subject, and plurality
    var verbTenses = Object.freeze({present:{}, past:{}, presentParticiple:{}, pastParticiple:{}});
    var subjects = Object.freeze({first:{}, second:{}, third:{}});
    
    var vowels = 'aeiou';
    var consonants = 'bcdfghjklmnpqrstvwxyz';
    
    module.exports.verbTenses = verbTenses;
    module.exports.subjects = subjects;
    
    module.exports.generateHaiku = generateHaiku;
    module.exports.conjugateVerb = conjugateVerb;
    
}());