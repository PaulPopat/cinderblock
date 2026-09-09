#include "./Instruction.h"

namespace Binary
{
  class LiteralBool : Instruction
  {
  public:
    const static char TypeName = 5;
    LiteralBool(char *binary, int offset);

    const int get_end() const;

  private:
    bool value;
    int end;
  };
}