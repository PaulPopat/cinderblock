#include "./Instruction.h"

namespace Binary
{
  class LiteralDouble : Instruction
  {
  public:
    const static int TypeName = 7;
    LiteralDouble(char *binary, int offset);

    const int get_end() const;

  private:
    double *value;
    int end;
  };
}