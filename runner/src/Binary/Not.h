#include "./Instruction.h"

namespace Binary
{
  class Not : Instruction
  {
  public:
    const static char Index = 0;
    Not(char *binary, int offset);
    const int get_end() const;

  private:
    Instruction *subject;
    int end;
  };
}