#include "./Instruction.h"

namespace Binary
{
  class Ternary : Instruction
  {
  public:
    const static char TypeName = 16;
    Ternary(char *binary, int offset);
    ~Ternary();
    const int get_end() const;

  private:
    Instruction *predicate;
    Instruction *positive;
    Instruction *negative;
    int end;
  };
}