#include "./Instruction.h"

namespace Binary
{
  class LiteralString : Instruction
  {
  public:
    const static char TypeName = 12;
    LiteralString(char *binary, int offset);

    const int get_end() const;

  private:
    const char *binary;
    const int offset;
    int end;
  };
}