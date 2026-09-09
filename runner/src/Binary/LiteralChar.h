#include "./Instruction.h"

namespace Binary
{
  class LiteralChar : Instruction
  {
  public:
    const static char TypeName = 6;
    LiteralChar(char *binary, int offset);

    const int get_end() const;

  private:
    char value;
    int end;
  };
}