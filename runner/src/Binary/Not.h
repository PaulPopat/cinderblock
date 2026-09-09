#include "./Instruction.h"

namespace Binary
{
  class Not : Instruction
  {
  public:
    const static char TypeName = 13;
    Not(char *binary, int offset);
    ~Not();
    const int get_end() const;

  private:
    Instruction *subject;
    int end;
  };
}