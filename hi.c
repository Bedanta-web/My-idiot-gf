#include <stdio.h>

int main() {
    int num, num2, sum;
    
    printf("Enter first number: ");
    scanf("%d", &num);
    
    printf("Enter second number: ");
    scanf("%d", &num2);
    
    sum = num + num2;
    printf("Sum of %d and %d is %d\n", num, num2, sum);
    
    return 0;
}