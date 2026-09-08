#include "./Instruction.h"

namespace Binary
{
  class LiteralLong : Instruction
  {
  public:
    const static int TypeName = 10;
    LiteralLong(char *binary, int offset);

    const int get_end() const;

  private:
    long* value;
    int end;
  };
}