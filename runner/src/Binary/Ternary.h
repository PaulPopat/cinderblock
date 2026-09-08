#include "./Instruction.h"

namespace Binary
{
  class Ternary : Instruction
  {
  public:
    const static char Index = 0;
    Ternary(char *binary, int offset);
    const int get_end() const;

  private:
    Instruction *predicate;
    Instruction *positive;
    Instruction *negative;
    int end;
  };
}