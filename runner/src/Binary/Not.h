#include "./Instruction.h"

namespace Binary
{
  class Not : Instruction
  {
  public:
    Not(char *binary, int offset);
    const int get_end() const;

  private:
    Instruction *subject;
    int end;
  };
}