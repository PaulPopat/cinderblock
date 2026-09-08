#include "./Instruction.h"

namespace Binary
{
  class Not : Instruction
  {
  public:
    const static int TypeName = 13;
    Not(char *binary, int offset);
    const int get_end() const;

  private:
    Instruction *subject;
    int end;
  };
}