#include "./Instruction.h"
#include "./LiteralString.h"

namespace Binary
{
  class External : Instruction
  {
  public:
    const static char TypeName = 3;
    External(char *binary, int offset);
    ~External();
    const int get_end() const;

  private:
    LiteralString *name;
    int end;
  };
}