#include "./Instruction.h"

namespace Binary
{
  class LiteralString : Instruction
  {
  public:
    LiteralString(char *binary, int offset);

    const int get_end() const;

  private:
    const char* binary;
    const int offset;
    int end;
  };
}