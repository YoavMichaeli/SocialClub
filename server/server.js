// In this part of the code we implement server logic

function calc(x,y,operation){
    switch (operation) {
        case '0':
            return x+y
        case '1':
            return x-y            
        case '2':
            return x*y
        case '3':
            return x/y
        default:            
            return 'incalculable'
    }
};

module.exports = {calc};

