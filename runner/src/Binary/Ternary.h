#include "./Instruction.h"

namespace Binary
{
  class Ternary : Instruction
  {
  public:
    const static int TypeName = 16;
    Ternary(char *binary, int offset);
    const int get_end() const;

  private:
    Instruction *predicate;
    Instruction *positive;
    Instruction *negative;
    int end;
  };
}