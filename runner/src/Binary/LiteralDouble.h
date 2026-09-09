#include "./Instruction.h"

namespace Binary
{
  class LiteralDouble : Instruction
  {
  public:
    const static char TypeName = 7;
    LiteralDouble(char *binary, int offset);
    ~LiteralDouble();

    const int get_end() const;

  private:
    double *value;
    int end;
  };
}