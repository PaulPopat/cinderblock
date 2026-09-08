#include "./Instruction.h"

namespace Binary
{
  enum OperatorType
  {
    Add = 0,
    And = 1,
    Divide = 2,
    Equals = 3,
    GreaterThan = 4,
    GreaterThanOrEqualTo = 5,
    In = 6,
    LessThan = 7,
    LessThanOrEqualTo = 8,
    Multiply = 9,
    NotEquals = 10,
    Or = 11,
    PartialPipe = 12,
    Pipe = 13,
    Subtract = 14
  };

  class Operator : Instruction
  {
  public:
    const static char Index = 0;
    Operator(char *binary, int offset);
    const int get_end() const;

  private:
    OperatorType type;
    Instruction *left;
    Instruction *right;
    int end;
  };
}