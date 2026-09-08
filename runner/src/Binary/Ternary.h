#include "./Instruction.h"

namespace Binary
{
  class Ternary : Instruction
  {
  public:
    Ternary(char *binary, int offset);
    const int get_end() const;

  private:
    Instruction *predicate;
    Instruction *positive;
    Instruction *negative;
    int end;
  };
}