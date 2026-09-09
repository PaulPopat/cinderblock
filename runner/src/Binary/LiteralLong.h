#include "./Instruction.h"

namespace Binary
{
  class LiteralLong : Instruction
  {
  public:
    const static char TypeName = 10;
    LiteralLong(char *binary, int offset);
    ~LiteralLong();

    const int get_end() const;

  private:
    long *value;
    int end;
  };
}